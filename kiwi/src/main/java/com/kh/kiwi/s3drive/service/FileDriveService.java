package com.kh.kiwi.s3drive.service;

import com.kh.kiwi.s3drive.dto.FileDriveDTO;
import com.kh.kiwi.s3drive.entity.FileDrive;
import com.kh.kiwi.s3drive.repository.FileDriveRepository;
import com.kh.kiwi.s3file.repository.FileDriveFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileDriveService {

    private final S3Client s3Client;
    private final FileDriveRepository fileDriveRepository;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Autowired
    public FileDriveService(S3Client s3Client, FileDriveRepository fileDriveRepository) {
        this.s3Client = s3Client;
        this.fileDriveRepository = fileDriveRepository;
    }

    public FileDriveDTO createDrive(FileDriveDTO fileDriveDTO) {
        // 드라이브 코드 생성
        String driveCode = UUID.randomUUID().toString();

        // S3에 폴더 생성
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(driveCode + "/") // 드라이브 코드를 폴더명으로 사용하여 폴더 생성
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(new byte[0]));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create folder in S3", e);
        }

        // 드라이브 정보 저장
        FileDrive fileDrive = new FileDrive();
        fileDrive.setDriveCode(driveCode);
        fileDrive.setDriveName(fileDriveDTO.getDriveName());
        fileDrive.setTeam(fileDriveDTO.getTeam());
        fileDriveRepository.save(fileDrive);

        // 드라이브 DTO 반환
        return new FileDriveDTO(driveCode, fileDriveDTO.getDriveName(), fileDriveDTO.getTeam());
    }

    public List<FileDriveDTO> listDrives() {
        return fileDriveRepository.findAll().stream()
                .map(fileDrive -> new FileDriveDTO(fileDrive.getDriveCode(), fileDrive.getDriveName(), fileDrive.getTeam()))
                .collect(Collectors.toList());
    }

    public void deleteDrive(String driveCode) {
        // S3에서 폴더 삭제
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(driveCode + "/") // 드라이브 코드를 폴더명으로 사용하여 폴더 삭제
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to delete folder in S3", e);
        }

        // 드라이브 정보 삭제
        fileDriveRepository.deleteById(driveCode);
    }

    public void updateDrive(String driveCode, FileDriveDTO fileDriveDTO) {
        FileDrive fileDrive = fileDriveRepository.findById(driveCode)
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        fileDrive.setDriveName(fileDriveDTO.getDriveName());
        fileDriveRepository.save(fileDrive);
    }
}
