import React from 'react';
import img from '../Images/image1.jpg';

const Home = () => {
    return (
        <>
            <section className="Home">
                <div>
                <h1>O projekte</h1>
                <p>Aplikácia vznikla ako ročníkový projekt na predmete Tvorba informačných systémov.</p>
                <p>
                    Aplikácia pomôže pri učení sa cudzích jazykov. Hlavne je vytvorené pre študentov,
                    ale je užitočné aj pre každých, ktorí chcú precvičiť cudzie jazyky.
                </p>
                <p>
                    Cieľovou skupinou je teda každý človek, ktorý sa chce precvičiť znalosť z cudzieho
                    jazyka.
                </p>
                <p>
                    V aplikácii používateľ môže pridať rôzne úlohy. Existujú dva typy úloh. Prvý typ je,
                    že pridá obrázok a popis, čo je na obrázku. Druhým typom je, keď pridá len obrázky s
                    textom, ktoré v správnom poradí formulujú korektnú vetu. V prvom prípade úlohou
                    cvičiaceho je uhádnutie čo je na obrázku a v druhom prípade musí poskladať korektnú
                    vetu z pomiešaných obrázkov.
                </p>
                </div>
                <img src={img} alt="rek"/>
            </section>
        </>
    );
};


export default Home;