package websocket;

import org.json.JSONObject;
import org.json.simple.parser.ParseException;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/game")
public class socket {
    private static final Set<Session> userSessions = Collections.newSetFromMap(new ConcurrentHashMap<Session, Boolean>());

    @OnOpen
    public void onOpen(Session curSession) {
        userSessions.add(curSession);
    }

    @OnClose
    public void onClose(Session curSession) {
        userSessions.remove(curSession);
        for (Session ses : userSessions) {
            if (ses.getUserProperties().get("session_id").equals(curSession.getUserProperties().get("session_id"))) {
                ses.getAsyncRemote().sendText("Disconnected");
            }
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) throws ParseException, IOException {
        try {
            JSONObject jsonData = new JSONObject(message);
            String session_id = jsonData.getString("sessionId");
            if (session.getUserProperties().get("session_id") == null) {
                session.getUserProperties().put("session_id", session_id);
            }
            int count = 0;
            for (Session ses : userSessions) {
                if (ses.getUserProperties().get("session_id").equals(session_id))
                    count++;
            }
            for (Session ses : userSessions) {
                if (ses.getUserProperties().get("session_id").equals(session_id)) {
                    if (count == 2)
                        ses.getAsyncRemote().sendText(message);
                    else
                        ses.getAsyncRemote().sendText("NotJoin");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
