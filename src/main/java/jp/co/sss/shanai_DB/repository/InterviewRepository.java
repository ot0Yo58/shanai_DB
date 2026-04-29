package jp.co.sss.shanai_DB.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jp.co.sss.shanai_DB.entity.Interview;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByEmployeeIdOrderByInterviewDateDescIdDesc(Long employeeId);
}