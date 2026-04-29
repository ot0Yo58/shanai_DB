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
@Table(name = "support_cases")
public class SupportCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 問い合わせ / トラブル / 勤怠 / Cytech / 人間関係 / その他
    @Column(name = "case_type", length = 100)
    private String caseType;

    @Column(length = 255)
    private String title;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name = "occurred_at")
    private LocalDate occurredAt;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "cause_text", columnDefinition = "TEXT")
    private String causeText;

    @Column(name = "response_text", columnDefinition = "TEXT")
    private String responseText;

    @Column(columnDefinition = "TEXT")
    private String prevention;

    // 未対応 / 対応中 / 対応済み / 経過観察
    @Column(length = 50)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public SupportCase() {
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

    public String getCaseType() {
        return caseType;
    }

    public String getTitle() {
        return title;
    }

    public LocalDate getOccurredAt() {
        return occurredAt;
    }

    public String getContent() {
        return content;
    }

    public String getCauseText() {
        return causeText;
    }

    public String getResponseText() {
        return responseText;
    }

    public String getPrevention() {
        return prevention;
    }

    public String getStatus() {
        return status;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCaseType(String caseType) {
        this.caseType = caseType;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setOccurredAt(LocalDate occurredAt) {
        this.occurredAt = occurredAt;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setCauseText(String causeText) {
        this.causeText = causeText;
    }

    public void setResponseText(String responseText) {
        this.responseText = responseText;
    }

    public void setPrevention(String prevention) {
        this.prevention = prevention;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}