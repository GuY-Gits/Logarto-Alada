package server;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ChatWebSocketHandler extends TextWebSocketHandler {

    // map for session ID and network connections
    private final Map<String, WebSocketSession> activeSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        activeSessions.put(session.getId(), session);
        System.out.println("SERVER: Connection OPENED - Session ID: " + session.getId());

        String alertMessage = "SYSTEM: Unknown connection detected on the network...";
        
        // message shown to others on network
        for (WebSocketSession activeSession : activeSessions.values()) {
            if (activeSession.isOpen() && !activeSession.getId().equals(session.getId())) {
                activeSession.sendMessage(new TextMessage(alertMessage));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        activeSessions.remove(session.getId());
        System.out.println("SERVER: Connection CLOSED - Session ID: " + session.getId());

        String alertMessage = "SYSTEM: A connection has dropped off the network.";
        
        for (WebSocketSession activeSession : activeSessions.values()) {
            if (activeSession.isOpen()) {
                activeSession.sendMessage(new TextMessage(alertMessage));
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        String senderId = session.getId();
        
        System.out.println("SERVER INTERCEPT: Received '" + payload + "' from session " + senderId);

        for (WebSocketSession activeSession : activeSessions.values()) {
            
            // check if session is active, make sure message does't comeback to author
            if (activeSession.isOpen() && !activeSession.getId().equals(senderId)) {
                activeSession.sendMessage(new TextMessage(payload));
            }
        }
    }
}
