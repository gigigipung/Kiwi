package com.kh.kiwi.documents.service;

import com.kh.kiwi.documents.dto.ApprovalLineDto;
import com.kh.kiwi.documents.dto.CommentDto;
import com.kh.kiwi.documents.entity.*;
import com.kh.kiwi.documents.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DocService {
    // 기존 변수 선언들
    private final DocRepository docRepository;
    private final ApprovalLineRepository approvalLineRepository;
    private final ReferrerRepository referrerRepository;
    private final MemberDetailsRepository memberDetailsRepository;
    private final CommentRepository commentRepository;

    public DocService(DocRepository docRepository, ApprovalLineRepository approvalLineRepository, ReferrerRepository referrerRepository, MemberDetailsRepository memberDetailsRepository, CommentRepository commentRepository) {
        this.docRepository = docRepository;
        this.approvalLineRepository = approvalLineRepository;
        this.referrerRepository = referrerRepository;
        this.memberDetailsRepository = memberDetailsRepository;
        this.commentRepository = commentRepository;
    }

    public List<Doc> selectAllList() {
        return docRepository.findAll();
    }

    // 문서 상태별 문서를 가져오는 메서드
    public List<Doc> getDocumentsByStatus(Doc.DocStatus status) {
        return docRepository.findByDocStatus(status);
    }

    public Map<String, Long> getCountByStatus() {
        long inProgressCount = docRepository.countByDocStatus(Doc.DocStatus.진행중);
        long completedCount = docRepository.countByDocStatus(Doc.DocStatus.완료);
        long rejectedCount = docRepository.countByDocStatus(Doc.DocStatus.반려);

        Map<String, Long> countMap = new HashMap<>();
        countMap.put("진행중", inProgressCount);
        countMap.put("완료", completedCount);
        countMap.put("반려", rejectedCount);
        countMap.put("전체", inProgressCount + completedCount + rejectedCount);

        return countMap;
    }

    public Doc getDocWithApprovalAndReferences(Long docNum) {
        Doc doc = docRepository.findByDocNum(docNum);
        if (doc != null) {
            List<ApprovalLine> approvalLines = approvalLineRepository.findByDocNum(docNum);
            List<DocReferrer> references = referrerRepository.findByDocNum(docNum);
            doc.setApprovalLines(approvalLines);
            doc.setReferences(references);
        }
        return doc;
    }

    public Doc getDocById(Long id) {
        return docRepository.findById(id).orElse(null);
    }



    public void addDoc(Doc doc) {
        if (doc.getDocTitle() == null || doc.getDocTitle().trim().isEmpty()) {
            doc.setDocTitle("기본 제목");
        }
        if (doc.getName() == null || doc.getName().trim().isEmpty()) {
            MemberDetails memberDetails = memberDetailsRepository.findById(doc.getEmployeeNo())
                    .orElseThrow(() -> new RuntimeException("사원 정보를 찾을 수 없습니다."));
            doc.setName(memberDetails.getName());
        }
        if (doc.getDocContents() == null || doc.getDocContents().trim().isEmpty()) {
            doc.setDocContents("내용 없음");
        }
        if (doc.getRetentionPeriod() == null || doc.getRetentionPeriod().trim().isEmpty()) {
            doc.setRetentionPeriod("1년");
        }
        if (doc.getAccessLevel() == null) {
            doc.setAccessLevel(Doc.AccessLevel.C);
        }

        docRepository.save(doc);
    }


    public void saveApprovalLine(Doc doc, ApprovalLineDto approvalLineDto) {
        // 결재자 저장
        for (int i = 0; i < approvalLineDto.getApprovers().size(); i++) {
            ApprovalLine approvalLine = new ApprovalLine();
            approvalLine.setDocNum(doc.getDocNum());
            approvalLine.setDocSeq(String.valueOf(i + 1)); // 결재 순서 설정
            approvalLine.setEmployeeNo(approvalLineDto.getApprovers().get(i).getEmployeeNo());
            approvalLine.setDocConf(0); // 기본값 설정
            approvalLineRepository.save(approvalLine);
        }

        // 참조자 저장
        for (int i = 0; i < approvalLineDto.getReferences().size(); i++) {
            DocReferrer referrer = new DocReferrer();
            referrer.setDocNum(doc.getDocNum());
            referrer.setMemberId(approvalLineDto.getReferences().get(i).getEmployeeNo()); // 예시: 실제 로직에 따라 값을 설정
            referrer.setEmployeeNo(approvalLineDto.getReferences().get(i).getEmployeeNo());
            referrerRepository.save(referrer);
        }
    }

    public void updateDoc(Long id, Doc updatedDoc) {
        Doc existingDoc = docRepository.findById(id).orElse(null);
        if (existingDoc != null) {
            existingDoc.setDocTitle(updatedDoc.getDocTitle());
            existingDoc.setDocContents(updatedDoc.getDocContents());
            existingDoc.setDocStatus(updatedDoc.getDocStatus());
            docRepository.save(existingDoc);
        }
    }

    public void deleteDoc(Long id) {
        docRepository.deleteById(id);
    }

    public List<ApprovalLine> getAllApprovalLines() {
        return approvalLineRepository.findAll();
    }

    public Doc getDocByDocNum(Long docNum) {
        return docRepository.findByDocNum(docNum);
    }
    public List<Comment> getCommentsByDoc(Doc doc) {
        return commentRepository.findByDoc(doc);
    }


    public Comment addComment(Long docNum, CommentDto commentDto) {
        System.out.println("addComment called with docNum: " + docNum + " and commentDto: " + commentDto);

        Doc doc = docRepository.findByDocNum(docNum);
        if (doc == null) {
            throw new EntityNotFoundException("해당 문서를 찾을 수 없습니다.");
        }

        // 사원 번호로 MemberDetails를 조회
        MemberDetails employee = memberDetailsRepository.findById(commentDto.getEmployeeNo())
                .orElseThrow(() -> {
                    System.err.println("해당 사원을 찾을 수 없습니다: " + commentDto.getEmployeeNo());
                    return new EntityNotFoundException("해당 사원을 찾을 수 없습니다.");
                });

        Comment comment = new Comment();
        comment.setDoc(doc);
        comment.setContent(commentDto.getContent());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setEmployee(employee);

        commentRepository.save(comment);
        System.out.println("의견이 저장되었습니다.");

        return comment;
    }


}
