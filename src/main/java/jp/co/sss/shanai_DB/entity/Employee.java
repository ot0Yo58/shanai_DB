package jp.co.sss.shanai_DB.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_code", length = 50)
    private String employeeCode;

    @NotBlank(message = "名前は必須です")
    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "name_kana", length = 100)
    private String nameKana;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    @Column(columnDefinition = "TEXT")
    private String address;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name = "join_date")
    private LocalDate joinDate;

    @Column(name = "commute_method", length = 255)
    private String commuteMethod;

    @Column(name = "future_vision", columnDefinition = "TEXT")
    private String futureVision;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CytechProgress> cytechProgresses = new ArrayList<>();

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Interview> interviews = new ArrayList<>();

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SupportCase> supportCases = new ArrayList<>();

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PrivateEvent> privateEvents = new ArrayList<>();

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InternalEventParticipation> internalEventParticipations = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Employee() {
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

    public String getEmployeeCode() {
        return employeeCode;
    }

    public String getName() {
        return name;
    }

    public String getNameKana() {
        return nameKana;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public String getAddress() {
        return address;
    }

    public LocalDate getJoinDate() {
        return joinDate;
    }

    public String getCommuteMethod() {
        return commuteMethod;
    }

    public String getFutureVision() {
        return futureVision;
    }

    public String getMemo() {
        return memo;
    }

    public List<CytechProgress> getCytechProgresses() {
        return cytechProgresses;
    }

    public List<Interview> getInterviews() {
        return interviews;
    }

    public List<SupportCase> getSupportCases() {
        return supportCases;
    }

    public List<PrivateEvent> getPrivateEvents() {
        return privateEvents;
    }

    public List<InternalEventParticipation> getInternalEventParticipations() {
        return internalEventParticipations;
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

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setNameKana(String nameKana) {
        this.nameKana = nameKana;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setJoinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
    }

    public void setCommuteMethod(String commuteMethod) {
        this.commuteMethod = commuteMethod;
    }

    public void setFutureVision(String futureVision) {
        this.futureVision = futureVision;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public void setCytechProgresses(List<CytechProgress> cytechProgresses) {
        this.cytechProgresses = cytechProgresses;
    }

    public void setInterviews(List<Interview> interviews) {
        this.interviews = interviews;
    }

    public void setSupportCases(List<SupportCase> supportCases) {
        this.supportCases = supportCases;
    }

    public void setPrivateEvents(List<PrivateEvent> privateEvents) {
        this.privateEvents = privateEvents;
    }

    public void setInternalEventParticipations(List<InternalEventParticipation> internalEventParticipations) {
        this.internalEventParticipations = internalEventParticipations;
    }
}