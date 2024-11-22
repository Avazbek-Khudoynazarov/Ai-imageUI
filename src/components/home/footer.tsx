import React from "react";
import "./css/footer.css";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="main-footer">
      <div className="footer-logo">
        <Image
          width={105}
          height={40}
          src="./assets/home/yeongnamLogo.svg"
          alt=""
          draggable={false}
        />
      </div>
      <span>
        대구본사 : 대구광역시 동구 동대구로 441(신천동 111번지) |
        <b> Tel. 053-756-8001</b> |<b> Fax. 053-756-9011</b> <br /> 경북본사 :
        경상북도 안동시 풍천면 수호로 59 우대빌딩 4층 |​{" "}
        <b>Tel. 054-857-9393</b> |<b> Fax. 054-857-8602 </b>| 서울지사 :
        서울특별시 중구 세종대로 124 프레스센터 11층 |<b> Tel. 02-738-9815 </b>|
        <b> Fax. 02-738-8005</b>
        <br /> 인터넷신문등록 : 대구 아00221 | 등록일자 : 2017.05.23 | 발행인 ·
        편집인 : 이승익 | 사업자등록번호 :<b> 502-81-25414 </b>| 법인명 :
        (주)영남일보 | 대표자 : 이승익
      </span>
    </div>
  );
}
