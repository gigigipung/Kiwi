package com.kh.kiwi.chat.controller;

import com.kh.kiwi.chat.dto.ChatMessage;
import com.kh.kiwi.chat.dto.MessageReadDto;
import com.kh.kiwi.chat.service.MessageChatnumService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat/message")
public class ChatMessageController {

    private static final Logger log = LoggerFactory.getLogger(ChatMessageController.class);

    @Autowired
    private MessageChatnumService messageChatnumService;

    @MessageMapping("/chat.sendMessage/{chatNum}")
    @SendTo("/topic/chat/{chatNum}")
    public ChatMessage sendMessage(ChatMessage message) {
        message.setChatTime(LocalDateTime.now());
        String memberNickname = messageChatnumService.getNicknameByEmail(message.getSender());
        String memberFilepath = messageChatnumService.getFilepathByEmail(message.getSender());
        message.setMemberFilepath(memberFilepath);
        message.setMemberNickname(memberNickname);
        message.setChatContent(message.getContent());
        messageChatnumService.saveMessage(message);
        log.debug("Message sent: {}", message);
        return message;
    }


    @PostMapping("/upload")
    public List<ChatMessage.FileInfo> uploadFiles(@RequestParam("files") MultipartFile[] files,
                                                  @RequestParam("team") String team,
                                                  @RequestParam("chatNum") String chatNum) throws IOException {
        log.debug("Uploading files for chatNum: {}", chatNum);
        return messageChatnumService.uploadFiles(files, team, chatNum);
    }



    @GetMapping("/messages/{chatNum}")
    public List<ChatMessage> getMessagesByChatNum(@PathVariable Integer chatNum) {
        log.debug("Fetching messages for chatNum: {}", chatNum);
        return messageChatnumService.getMessagesByChatNum(chatNum);
    }

    @GetMapping("/download")
    public byte[] downloadFile(@RequestParam String fileKey) {
        log.debug("Downloading file with key: {}", fileKey);
        return messageChatnumService.downloadFile(fileKey);
    }

    @DeleteMapping("/delete/{messageId}")
    public void deleteMessage(@PathVariable String messageId, @RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        log.info("Received request to delete message with ID: {} by user: {}", messageId, username);
        messageChatnumService.deleteMessageByIdAndUsername(messageId, username);
    }

    @PostMapping("/read")
    public ResponseEntity<?> markMessageAsRead(@RequestBody MessageReadDto messageReadDto) {
        log.debug("Marking message as read: {}", messageReadDto);
        if (messageReadDto.getMemberId() == null || messageReadDto.getMemberId().isEmpty()) {
            return ResponseEntity.badRequest().body("Member ID is null or empty");
        }

        boolean isAlreadyRead = messageChatnumService.isMessageAlreadyRead(messageReadDto.getMessageNum(), messageReadDto.getMemberId());
        if (!isAlreadyRead) {
            messageChatnumService.markMessageAsRead(messageReadDto);
            messageChatnumService.broadcastMessageRead(messageReadDto);
        }
        return ResponseEntity.ok().body(Map.of("isAlreadyRead", isAlreadyRead));
    }

    @GetMapping("/unreadCount/{chatNum}/{messageNum}")
    public ResponseEntity<Integer> getUnreadCount(@PathVariable int chatNum, @PathVariable String messageNum) {
        log.debug("Fetching unread count for chatNum: {}, messageNum: {}", chatNum, messageNum);
        int unreadCount = messageChatnumService.getUnreadCount(chatNum, messageNum);
        return ResponseEntity.ok(unreadCount);
    }

    @MessageMapping("/chat.readMessage/{chatNum}")
    @SendTo("/topic/chat/{chatNum}")
    public MessageReadDto broadcastMessageRead(MessageReadDto messageReadDto) {
        return messageReadDto;
    }

    @GetMapping("/firstUnread/{chatNum}/{memberId}")
    public ResponseEntity<ChatMessage> getFirstUnreadMessage(@PathVariable int chatNum, @PathVariable String memberId) {
        ChatMessage firstUnreadMessage = messageChatnumService.getFirstUnreadMessage(chatNum, memberId);
        if (firstUnreadMessage == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(firstUnreadMessage);
    }
}
