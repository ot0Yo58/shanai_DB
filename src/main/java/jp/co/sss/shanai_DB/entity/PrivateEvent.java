package jp.co.sss.shanai_DB.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Table(name = "private_events")
public class PrivateEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name = "event_date")
    private LocalDate eventDate;

    // 結婚 / 出産 / 引っ越し / 家庭都合 / 体調 / その他
    @Column(name = "event_type", length = 100)
    private String eventType;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    // HRのみ / 管理者のみ / 教育担当まで など
    @Column(name = "visibility_level", length = 100)
    private String visibilityLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PrivateEvent() {
    }

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public String getEventType() {
        return eventType;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getVisibilityLevel() {
        return visibilityLevel;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setVisibilityLevel(String visibilityLevel) {
        this.visibilityLevel = visibilityLevel;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}