package com.apes.planet.box.response;

public class BaseResponse {
    private Boolean isSuccess = true;
    private int responseCode = 0;
    private String responseMsg = "OK";

    public BaseResponse() {
    }

    public BaseResponse(Boolean isSuccess, int responseCode, String responseMsg) {
        this.isSuccess = isSuccess;
        this.responseCode = responseCode;
        this.responseMsg = responseMsg;
    }

    public Boolean getSuccess() {
        return isSuccess;
    }

    public void setSuccess(Boolean success) {
        isSuccess = success;
    }

    public int getResponseCode() {
        return responseCode;
    }

    public void setResponseCode(int responseCode) {
        this.responseCode = responseCode;
    }

    public String getResponseMsg() {
        return responseMsg;
    }

    public void setResponseMsg(String responseMsg) {
        this.responseMsg = responseMsg;
    }
}
