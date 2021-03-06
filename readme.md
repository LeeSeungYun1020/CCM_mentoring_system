# CCM 멘토링 시스템

## 프로젝트 개요

### 1. 멘토링
 멘토링은 그리스 신화에서 유래한 단어이다.  
그리스 연합국 중 하나인 이티카의 왕이였던 오디세우스는 전쟁에 나가기 전 어린 아들을 친구 멘토에게 맡겼고  
친구는 때로는 엄한 아버지가 되기도 조언자가 되기도 선생이 되기도 하며 아들의 정신적 지주 역할을 잘 감당하였다.  
오디세우스가 10년간의 전쟁 이후 돌아왔을때 아들은 놀랍도록 훌륭하게 성장하였다.  
오디세우스는 친구에게 **"역시 멘토다워"** 라고 크게 칭찬하였고  
이후 백성들 사이에서 훌륭하게 제자를 교육시킨 사람에게 멘토라는 호칭을 주는 것이 유행하였다.  [[1]](https://ko.wikipedia.org/wiki/%EB%A9%98%ED%86%A0%EB%A7%81)  
<br>
 원래는 풍부한 경험과 지혜를 겸비한 신뢰할 수 있는 사람이 1:1로 지도, 조언을 하는 것만을 의미했지만  
현대에는 경험이나 지혜가 풍부하지 않아도 서로 도와가며 배울 수 있는 프로그램, 행사  
1:1이 아닌 다수를 지도하거나 조언하는 프로젝트도 멘토링의 범주에 포괄적으로 포함되고 있다.  
<br>
 멘티는 멘토링 활동을 통해 프로그래밍에 대한 흥미와 자존감을 높이고,  
협력을 통해 대인 관계 증진과 공동 개발 과정을 체험할 수 있다.  
 멘토는 알고 있는 지식을 정리하고 다시 되짚어볼 수 있는 계기가 될 수 있으며,  
멘티의 변화 과정을 보면서 뿌듯함을 느끼고 자존감을 향상시킬 수 있다.  

### 2. 코딩 역량 관리 시스템(CCM)
 코딩 역량 관리 시스템은 코딩 역량을 온라인으로 확인하고 교수, 기업체 멘토가 조력하여 코딩 역량을 높일 수 있도록 하는 시스템이다.  
오픈소스 SonarQube 기반 코딩 분석 시스템과 관리자, 교수, 조교, 학생, 멘토별 웹 기반 코딩역량 관리 시스템으로 구성된다. 

### 3. 지향점
1. 멘토링의 의미가 확장되고 있는 만큼 1:1 멘토링 부터 팀별 멘토링, 집단 멘토링을 지원하고자 한다.
    - 각 사용자는 팀에 가입할 수 있고 팀별 게시판이 존재한다.
1. 멘토링은 질문을 중심으로 진행된다.
    - 각 질문은 여러개의 답변을 가질 수 있다.
    - 누구나 질문을 올릴 수 있다.
    - 질문은 질문자가 설정한 범위(전체, 팀)에 해당하는 사람만 답변할 수 있다.
    - 질문에는 태그를 추가하여 태그별로 분류, 검색할 수 있다.
    - 질문에는 코드 삽입 및 멘토링에 필요한 다양한 표현이 가능하다.

### 4. 개발 현황
1. 기본 구조 - 완료
    - 헤더 - 완료
    - 네비게이션 - 완료
    - 푸터 - 완료
    - 알림 - 완료
    - 검색 - 완료
1. 로그인 - 완료
    - 회원 가입 - 완료
    - 로그인, 로그아웃 - 완료
    - 로그인 팝업 - 완료
    - 정보 조회 - 완료
1. 질문 - 완료
    - 질문 작성 - 완료
    - 질문 수정 - 완료
    - 질문 삭제 - 완료
    - 질문 상세 - 완료
    - 질문 목록 - 완료
1. 답변 - 완료
    - 답변 작성 - 완료
    - 답변 수정 - 완료
    - 답변 삭제 - 완료
1. 멘토 찾기 - 완료
    - 멘토 목록 - 완료
    - 팀 생성 - 완료
    - 팀 가입 - 완료
    - 팀 탈퇴 - 완료
    - 질문 및 답변 팀 - 완료

## 요구사항

- Node.js >= 14
- MySQL >= 8.0

## 설치방법

### 1. 관련 프로그램 설치
[node.js 설치](https://nodejs.org/ko/)  
[MySQL Community Server 설치](https://dev.mysql.com/downloads/)  

### 2. node.js 모듈 설치
``` text
npm install
```
### 3. 데이터베이스 설정
호환성 확보를 위해 Retain MySQL 5.x Compatibility 설정  
root password: lsy1020
```mysql
create database mentoring;
create database session;

use mentoring;
create table team (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name NVARCHAR(32) unique NOT NULL,
    mentorID VARCHAR(16) NOT NULL,
    tag varchar(128) default 'PROGRAM' not null
);

create table user (
    id VARCHAR(16) PRIMARY KEY ,
    pw VARCHAR(32) NOT NULL ,
    name NVARCHAR(16) NOT NULL ,
    email VARCHAR(32),
    phone VARCHAR(16),
    type INT NOT NULL DEFAULT 0,
    teamID INT,
    questionPoint INT NOT NULL DEFAULT 0,
    answerPoint INT NOT NULL DEFAULT 0,
    image int default 0 not null,
    FOREIGN KEY (teamID) REFERENCES Team(id) ON UPDATE CASCADE ON DELETE SET NULL
);

create table question(
    id INT PRIMARY KEY AUTO_INCREMENT,
    title NVARCHAR(64) NOT NULL ,
    userID VARCHAR(16) NOT NULL ,
    contents MEDIUMTEXT NOT NULL ,
    date datetime DEFAULT current_timestamp,
    modifyDate datetime DEFAULT current_timestamp ON UPDATE current_timestamp,
    viewRange INT NOT NULL DEFAULT 0,
    viewID INT,
    tag NVARCHAR(128),
    point INT NOT NULL DEFAULT 0,
    FOREIGN KEY (userID) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE
);

create table answer(
    id INT PRIMARY KEY AUTO_INCREMENT,
    userID VARCHAR(16) NOT NULL ,
    contents MEDIUMTEXT NOT NULL ,
    date datetime DEFAULT current_timestamp,
    modifyDate datetime DEFAULT current_timestamp ON UPDATE current_timestamp,
    point INT NOT NULL DEFAULT 0,
    questionID INT,
    FOREIGN KEY (questionID) REFERENCES question(id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE team
ADD
FOREIGN KEY (mentorID)
REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE;
```

### 4. 서버 실행
```text
node ./bin/www
```

### 5. 서버 접속
http://localhost:3000/

## 참여인원

- 이승윤, ileilliat@gmail.com.
1. 레이아웃  
		- 헤더, 네비게이션, 푸터, 검색, 질문 목록, 질문 상세, 답변, 팀
2. 기능  
		- 헤더, 네비게이션, 푸터, 검색, 회원 가입 로그인, 질문 목록, 질문 상세, 답변, 팀
3. 데이터베이스  
4. 보고서  
		- 개발 배경, 상세 설계, 개발 결과, 개발 일정, 참고 문헌
<br><br>
- 심재영, jysim0129@naver.com.
1. 레이아웃  
		- 회원 가입, 로그인, 홈, 로그인 팝업, 프로필 조회, 질문 작성, 멘토 목록, 사진
2. 기능  
		- 홈, 로그인 팝업, 프로필 조회, 질문 작성, 멘토 목록
3. 보고서  
		- 개발 배경, 개발 개요, 상세 설계, 참고 문헌

## 참고

### 코드
- MDN web docs, https://developer.mozilla.org
- w3schools.com, https://www.w3schools.com/sql
- TCP school, http://www.tcpschool.com/
- Microsoft docs, https://docs.microsoft.com/ko-kr/
- npm, https://www.npmjs.com/
- Express, https://expressjs.com/ko/guide
- Passport, http://www.passportjs.org/
- Quill, https://quilljs.com/

### 디자인
- Material design, https://material.io/develop/web
- Stack overflow, https://stackoverflow.com/
- Unsplash, https://unsplash.com/

## 라이센스

- Mozilla Public License 2.0

## 결과보고서
![결과보고서](./report/report-01.png)
![결과보고서](./report/report-02.png)
![결과보고서](./report/report-03.png)
![결과보고서](./report/report-04.png)
![결과보고서](./report/report-05.png)
![결과보고서](./report/report-06.png)
![결과보고서](./report/report-07.png)
![결과보고서](./report/report-08.png)
![결과보고서](./report/report-09.png)
![결과보고서](./report/report-10.png)
![결과보고서](./report/report-11.png)
![결과보고서](./report/report-12.png)
![결과보고서](./report/report-13.png)
![결과보고서](./report/report-14.png)
![결과보고서](./report/report-15.png)
![결과보고서](./report/report-16.png)
![결과보고서](./report/report-17.png)
![결과보고서](./report/report-18.png)
![결과보고서](./report/report-19.png)
![결과보고서](./report/report-20.png)
![결과보고서](./report/report-21.png)
![결과보고서](./report/report-22.png)
![결과보고서](./report/report-23.png)
![결과보고서](./report/report-24.png)
![결과보고서](./report/report-25.png)
![결과보고서](./report/report-26.png)
![결과보고서](./report/report-27.png)
![결과보고서](./report/report-28.png)
![결과보고서](./report/report-29.png)
![결과보고서](./report/report-30.png)
![결과보고서](./report/report-31.png)
![결과보고서](./report/report-32.png)