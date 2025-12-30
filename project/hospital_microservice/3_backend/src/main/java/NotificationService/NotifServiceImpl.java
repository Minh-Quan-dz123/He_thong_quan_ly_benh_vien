package NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sys.UserEntity;
import sys.UserService;

import java.util.List;

@Service
public class NotifServiceImpl implements NotifService {
    @Autowired
    private NotifRepository notifRepository;
    @Autowired
    private UserService userService;

    public NotifServiceImpl(NotifRepository notifRepository, UserService userService) {
        this.notifRepository = notifRepository;
        this.userService = userService;
    }

    @Override
    public NotifEntity fetchNotificationById(Integer id) {
        return notifRepository.findByNotificationId(id);
    }

    @Override
    public List<NotifEntity> fetchNotificationByUserId(Integer userId) {
        return notifRepository.findByUserId(userId);
    }

    @Override
    public NotifEntity createNotification(NotifEntity notifEntity) {
        return notifRepository.save(notifEntity);
    }

    @Override
    public void deleteNotification(Integer id) {
        notifRepository.deleteByNotificationId(id);
    }

    @Override
    public List<UserEntity> findByRole(Enum role) {
        return userService.findByRole(role);
    }

}
