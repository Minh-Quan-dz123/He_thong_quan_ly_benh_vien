package NotificationService;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class NotifEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer notificationId;

    private Integer userId;

    private String content;

    private String role ;

    private String type ;

    private LocalDateTime CreateAt;

    public void setNotificationId(Integer notificationId) {
        this.notificationId = notificationId;
    }

    public Integer getNotificationId() {
        return notificationId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getCreateAt() {
        return CreateAt;
    }

    public void setCreateAt(LocalDateTime createAt) {
        CreateAt = createAt;
    }
}
