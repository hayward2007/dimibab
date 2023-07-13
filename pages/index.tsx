import React from "react";
import lru from 'lru-cache';
import FadeLoader from "react-spinners/FadeLoader";
import { useState, useEffect } from "react";
import styles from '../styles/Home.module.css'

interface Bab {
    status: string;
    meal: {
        date : string;
        breakfast: string;
        lunch: string;
        dinner: string;
    }
}

export default function Main() {
    // 20:50 ~ 08:15 아침
    // 08:15 ~ 13:50 점심
    // 13:50 ~ 20:50 저녁
    // const [time, setTime] = useState(new Date().toLocaleTimeString());
    //날짜
    const [date, changeDate] = useState(new Date());
    const day = ['일','월','화','수','목','금','토'];
    //밥
    const [bab, setBab] = useState<Bab | null>(null);
    //밥 API 로딩
    const [loading, setLoading] = useState(true);
    //밥 API
    const getBab = async (date: string) => {
        setLoading(true);
        const url = `https://디미고급식.com/api/${date}`;
        try {
            await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            })
            .then((resp: Response) => resp.json())
            .then((resp: Bab) => {
                const typedResp: Bab = {
                    ...resp
                }
                setBab(typedResp);
                // console.log(bab);
    
            });
            setLoading(false);
        }
        catch (err) {
            console.log(err);
        }
    }
    //밥 리스트
    const babList = (time: string) => {
        try {
            var menu = time === "아침" ? bab?.meal.breakfast : time === "점심" ? bab?.meal.lunch : bab?.meal.dinner;
        }
        catch (err) {
            console.log(err);
            return <div>데이터가 없습니다</div>
        }

        return menu?.split('/').map((item, index) => {
            return (
                <div key={index}>
                    <span>-</span>
                    {item}
                </div>
            );
        });
    }

    // 캐시
    // const cache = lru({
    //     maxAge: 300000,                                              
    //     max: 500000000000,                                           
    //     length: 100,
    // });

    useEffect(() => {getBab(date.toLocaleDateString());}, [date]);


    return (
        <>
            {
                //배경화면
                // 모바일에서만 적용
                // time === "morning" ? 
                //     //아침
                //     <img src="breakfast.svg" alt="morning" className={styles.background}/> :
                // time === "lunch" ?
                //     //점심
                //     <img src="lunch.svg" alt="lunch" className={styles.background}/> :
                    //저녁
                    <img src="dinner.svg" alt="dinner" className={styles.background}/>
            }
            <div className={`${styles.main} column`}>
                {/* 헤더  */}
                <div className="row">
                    {/* 날짜  */}
                    <div className={`${styles.title} ${styles.glass}`} onClick={() => 
                        {
                            //오늘 날짜 가져오는 코드    
                            changeDate(new Date());
                            // getBab(date.toLocaleDateString());
                        }
                    }>
                        {(date.getMonth() + 1) + '월 ' + date.getDate() + '일 ' + day[date.getDay()] + '요일' }
                    </div>
                    {/* 이전 날짜 */}
                    <button className={`${styles.front} ${styles.button} ${styles.glass}`} onClick={() => 
                        {
                            //이전 날짜 가져오는 코드
                            var previousDate = new Date();
                            previousDate.setDate(date.getDate() - 1);
                            changeDate(previousDate);
                            // getBab(date.toLocaleDateString());
                        }
                    }>
                        <img src="arrow-left.svg"/>
                    </button>
                    {/* 다음 날짜 */}
                    <button className={`${styles.front} ${styles.button} ${styles.glass}`} onClick={() => 
                        {
                            //다음 날짜 가져오는 코드
                            var nextDate = new Date();
                            nextDate.setDate(date.getDate() + 1);
                            changeDate(nextDate);
                            // getBab(date.toLocaleDateString());
                        }
                    }>
                        <img src="arrow-right.svg"/>
                    </button>
                </div>
                {/* 메뉴 */}
                <div className="row" style={{height: "100%"}}>
                    <div className={`${styles.glass} ${styles.menu}`}>
                        <div className={styles.header}>
                            <img src="breakfast icon.svg"/>
                            아침
                        </div>
                        <div className={styles.dish}>
                            {babList("아침")}
                        </div>

                    </div>
                    <div className={`${styles.glass} ${styles.menu}`}>
                        <div className={styles.header}>
                            <img src="lunch icon.svg"/>
                            점심
                        </div>
                        <div className={styles.dish}>
                            {babList("점심")}
                        </div>
                    </div>
                    <div className={`${styles.glass} ${styles.menu}`}>
                        <div className={styles.header}>
                            <img src="dinner icon.svg"/>
                            저녁
                        </div>
                        <div className={styles.dish}>
                            {babList("저녁")}
                        </div>
                    </div>
                </div>
            </div>
            { loading && <div className={styles.loading}><FadeLoader color="white"/></div> }
        </>
    );
}