package jp.co.sss.shanai_DB.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jp.co.sss.shanai_DB.entity.SupportCase;

public interface SupportCaseRepository extends JpaRepository<SupportCase, Long> {

    List<SupportCase> findByEmployeeIdOrderByOccurredAtDescIdDesc(Long employeeId);
}