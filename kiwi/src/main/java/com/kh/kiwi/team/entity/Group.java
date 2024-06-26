package com.kh.kiwi.team.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name="GROUP_LIST")
@IdClass(GroupId.class)
public class Group {
    @Id
    @Column(name = "MEMBER_ID")
    private String memberId;
    @Id
    @Column(name = "TEAM")
    private String team;
}
