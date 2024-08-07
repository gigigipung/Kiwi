package com.kh.kiwi.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor(staticName = "set")
public class ResponseDto<D> {
    private boolean result;
    private String message;
    private D data;

    public  static <D> ResponseDto<D> setSuccess(String message) {
        return ResponseDto.set(true, message, null);
    }

    public static <D> ResponseDto<D> setFailed(String message)
    {
        return ResponseDto.set(false, message, null);
    }

    public static <D> ResponseDto<D> setSuccessData(String message, D data) {
        return ResponseDto.set(true, message, data);
    }

    public static <D> ResponseDto<D> setFailedData(String message, D data) {
        return ResponseDto.set(false, message, data);
    }
}
