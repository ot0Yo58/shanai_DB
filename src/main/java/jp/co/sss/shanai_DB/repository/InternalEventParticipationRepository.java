package jp.co.sss.shanai_DB.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jp.co.sss.shanai_DB.entity.InternalEventParticipation;

public interface InternalEventParticipationRepository extends JpaRepository<InternalEventParticipation, Long> {

    List<InternalEventParticipation> findByEmployeeIdOrderByEventDateDescIdDesc(Long employeeId);
}