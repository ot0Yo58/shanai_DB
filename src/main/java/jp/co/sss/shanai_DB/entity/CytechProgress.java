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
@Table(name = "cytech_progresses")
public class CytechProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 例：1, 2, 3...
    @Column(name = "step_number")
    private Integer stepNumber;

    // 例：HTML基礎、Laravel ECサイト作成など
    @Column(name = "step_name", length = 255)
    private String stepName;

    // 例：未着手、進行中、完了、詰まり中
    @Column(length = 50)
    private String status;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name = "started_at")
    private LocalDate startedAt;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name = "completed_at")
    private LocalDate completedAt;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CytechProgress() {
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

    public Integer getStepNumber() {
        return stepNumber;
    }

    public String getStepName() {
        return stepName;
    }

    public String getStatus() {
        return status;
    }

    public LocalDate getStartedAt() {
        return startedAt;
    }

    public LocalDate getCompletedAt() {
        return completedAt;
    }

    public String getMemo() {
        return memo;
    }

    public Employee getEmployee() {
        return employee;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStepNumber(Integer stepNumber) {
        this.stepNumber = stepNumber;
    }

    public void setStepName(String stepName) {
        this.stepName = stepName;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setStartedAt(LocalDate startedAt) {
        this.startedAt = startedAt;
    }

    public void setCompletedAt(LocalDate completedAt) {
        this.completedAt = completedAt;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}