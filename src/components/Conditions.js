import React, {Component} from 'react';
import {Grid, Paper, Typography} from "@material-ui/core";


export class Conditions extends Component {


    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Grid container justify={"center"} spacing={0}>
                <Grid item xs={12}>
                    <Typography variant={"h2"} style={{color: "white", margin: "1em"}}>
                        Podmínky služby Server-List.cz
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={10} md={8}>
                    <Paper style={{paddingTop: "1em"}}>
                        <Typography variant={"h3"} style={{margin: "1em"}}>
                            1. Poučení o službě Server-List.cz
                        </Typography>
                        <Grid container justify={"center"}>
                            <Grid item xs={10}>
                                <Typography component={"p"} paragraph align={"left"}>
                                    Tato aplikace byla vytvořena pro účely bakalářské práce `Portál pro sledování stavu
                                    herních serverů` (v angl.: `Game Server Status Monitoring Portal`). Tuto práci
                                    vypracoval student bakalářského studia FIT VUT, Dominik Skála (xskala11).
                                    <br/>
                                    Jejím účelem je sledování nejen stavů, ale dalších informací o herních serverech v
                                    reálném čase za účelem využití moderních technologií. Využití webového rozhraní
                                    pomocí API, možnost přístupu k serverům pro registrátory a integrace do hostingových
                                    služeb.

                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant={"h3"} style={{margin: "1em"}}>
                            2. Základní ustanovení
                        </Typography>
                        <Grid container justify={"center"}>
                            <Grid item xs={10}>
                                <Typography component={"p"} paragraph align={"left"}>
                                    Tyto Všeobecné smluvní podmínky (dále jen "VOP") upravují smluvní vztah mezi
                                    Provozovatelem a Zákazníkem.
                                    Provozovatelem internetových služeb (dále jen „Služby“) je fyzická osoba Dominik
                                    Skála, IČO: 05959489, se sídlem Dražovská 209, 683 35 Letonice, Česká republika.
                                    Zákazníkem se stává fyzická osoba způsobilá k právním úkonům nebo právnická osoba,
                                    která s Provozovatelem uzavře Smlouvu. K uzavření smlouvy dojde vytvořením záznamu
                                    serveru na stránkách „www.server-list.cz“ na některý z nabízených monitorovaných
                                    služeb Provozovatele. Objednáním služby Zákazník projevuje souhlas s těmito
                                    Všeobecnými smluvními podmínkami (VOP). Při objednání obdrží Zákazník od
                                    provozovatele přihlašovací údaje do administračního centra a další potřebné údaje.
                                    Zákazník bere na vědomí a souhlasí s tím, že není oprávněn uzavírat smlouvu s
                                    Provozovatelem a objednávat služby nabízené Provozovatelem jménem třetích stran,
                                    jestliže mu k tomu třetí strana nedala předem písemný souhlas. Tento písemný souhlas
                                    může být kdykoliv Provozovatelem vyžádán a Zákazník je povinen jej neprodleně
                                    předložit, jinak je Provozovatel oprávněn objednanou službu zrušit.
                                    Objednáním služby Zákazník vyjadřuje svůj jednoznačný souhlas a porozumění se
                                    Smlouvou, těmito VOP a všemi ostatními podmínkami souvisejícími s objednanou
                                    službou, stejně jako s obsahem, specifikací a cenou jím objednané služby dle nabídky
                                    Provozovatele. Zákazník i Provozovatel jsou povinni v průběhu trvání Smlouvy
                                    dodržovat všeobecně platné právní předpisy, ustanovení Smlouvy, tyto VOP a další
                                    podmínky v případě, že jsou součástí zákazníkem objednané služby.
                                    Zákazník uzavřením Smlouvy rovněž prohlašuje, že se seznámil s funkcemi dané služby
                                    a z toho důvodu není v rámci poskytnuté služby oprávněn požadovat vrácení již
                                    uhrazené platby za některou z nabízených služeb s odůvodněním, že mu provedení
                                    služby nevyhovuje.
                                    Zákazník v plné míře odpovídá za veškeré škody, které způsobí svým jednáním v
                                    rozporu s těmito VOP a/nebo právním řádem České republiky Provozovateli, jiným
                                    uživatelům Služeb nebo jiným třetím osobám. Této odpovědnosti se nelze zprostit.
                                    V případě, že Zákazník porušuje tyto VOP, je Provozovatel oprávněn pozastavit jeho
                                    Služby. Při zvlášť závažném porušení nebo opakovaném porušování těchto VOP je
                                    Provozovatel oprávněn službu zrušit.
                                    Pozastavením služby se rozumí znefunkčnění dané Služby a/nebo zamezení přístupu k
                                    dané Službě. Zákazník současně nemá přístup ani k žádným datům (souborům,
                                    databázím), která ke Službě patří, a lze je získat pouze prodloužením platnosti
                                    Služby nebo uhrazením poplatku za obnovu dat ze zálohy
                                    Zrušením služby se rozumí její pozastavení, ukončení a smazání dat této služby.
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant={"h3"} style={{margin: "1em"}}>
                            3. Práva a povinnosti poskytovatele
                        </Typography>
                        <Grid container justify={"center"}>
                            <Grid item xs={10}>
                                <Typography component={"p"} paragraph align={"left"}>
                                    Provozovatel neodpovídá za porušení práv k ochranným známkám, práv k obchodní firmě
                                    a jiných práv chráněných obecně závaznými právními předpisy, kterého se dopustí
                                    Zákazník užíváním služeb.
                                    Provozovatel neodpovídá za jakoukoli škodu či ztrátu, která byla nebo by mohla být
                                    Zákazníkovi způsobena v souvislosti s používáním služeb.
                                    Provozovatel je oprávněn změnit rozsah monitorovaných aplikací a jejich variant. Je
                                    však povinen tyto změny předem oznámit Zákazníkovi formou informace na WWW stránkách
                                    Provozovatele nebo písemně na email Zákazníka.
                                    Provozovatel není oprávněn zasahovat do dat vytvořených či umístěných Zákazníkem,
                                    není-li mezi nimi dohodnuto jinak. Tento zákaz neplatí v případě podezření
                                    týkajícího se porušení těchto smluvních podmínek, zneužití poskytované služby nebo
                                    porušení zákonů České republiky.
                                    V případě, že Zákazník porušuje tyto Smluvní podmínky nebo jiná ujednání s
                                    Provozovatelem, je Provozovatel oprávněn od Smlouvy jednostranně odstoupit a
                                    poskytovanou službu zrušit. V takovém případě budou data Zákazníka smazána a uložena
                                    na náhradním nosiči. V případě, že zákazník bude chtít tato data získat zpět,
                                    Provozovatel je oprávněn požadovat úhradu za tuto službu dle svého ceníku.
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant={"h3"} style={{margin: "1em"}}>
                            4. Práva a povinnosti zákazníka
                        </Typography>
                        <Grid container justify={"center"}>
                            <Grid item xs={10}>
                                <Typography component={"p"} paragraph align={"left"}>
                                    Zákazník je povinen používat služby podle návodů a instrukcí dodaných
                                    Provozovatelem.
                                    Zákazník se zavazuje provést na své straně veškerá opatření potřebná k zamezení
                                    zneužití služeb. Zákazník je odpovědný za následky takového zneužití, jestliže k
                                    němu dojde.
                                    Zákazník je povinen učinit všechna opatření pro ochranu všech přístupových údajů
                                    (přihlašovacího jména a hesla) všech uživatelů pro správu a užívání služeb a pro
                                    přístup do zákaznického účtu. Za jakékoliv škody, které vzniknou zneužitím systému
                                    cizí osobou, která k přístupu použije správné přihlašovací jméno a heslo, je
                                    odpovědný Zákazník.
                                    Zákazníkovi je zakázáno pokoušet se o narušení chodu služeb a technických či
                                    softwarových prostředků, záměrně je přetěžovat, pokoušet se využívat služeb či
                                    systémů v rozporu s jeho účelem.
                                    Zákazníkovi je zakázáno využívat služeb k účelům, které jsou v rozporu se zákony ČR
                                    či v rozporu s dobrými mravy, rozesílání nevyžádané pošty atd.
                                    Zákazník je povinen dodržovat obecně závazné právní předpisy České republiky a
                                    jednat v souladu s dobrými mravy a všeobecně uznávanými morálními a etickými
                                    normami. Zákazník zejména nesmí porušovat zákonem chráněná práva provozovatele a
                                    třetích osob.
                                    Zákazník ručí Provozovateli za správnost a úplnost údajů uvedených v registraci, ve
                                    všech objednávkových formulářích a dalších dokumentech. Zároveň je Zákazník povinen
                                    všechny změny ihned aktualizovat či nahlásit jejich změnu Provozovateli.
                                    Provozovatel neodpovídá za jakékoliv škody způsobené v důsledku uvedení neplatných
                                    či neaktuálních údajů.
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant={"h3"} style={{margin: "1em"}}>
                            5. Vyloučení z provozu
                        </Typography>
                        <Grid container justify={"center"}>
                            <Grid item xs={10}>
                                <Typography component={"p"} paragraph align={"left"}>
                                    Provozovatel může odmítnout poskytování služeb Zákazníkovi, jehož aktivita alespoň
                                    částečně spadá do některé z následujících kategorií nebo obsah, který poskytuje,
                                    ukládá, sdílí či stahuje, alespoň částečně spadá do některé z následujících
                                    kategorií:
                                    - je v rozporu s právním řádem České republiky či platnými mezinárodními úmluvami
                                    - je v rozporu s dobrými mravy - porušování autorských, patentových, průmyslových
                                    nebo jiných podobných práv
                                    - přímé či nepřímé poškozování jakýchkoliv práv třetích osob
                                    - přetěžování infrastruktury nebo technických či softwarových prostředků
                                    Provozovatele či jiných stran
                                    - ohrožování soukromí nebo bezpečnosti jiných systémů či osob
                                    Výše uvedené ustanovení se týká všeho, co se i částečně může zařadit do výše
                                    uvedených kategorií, přičemž rozhodnutí o porušení tohoto odstavce ze strany
                                    Zákazníka je výhradně na uvážení Provozovatele.
                                    Zákazník není oprávněn ukládat či sdílet programy nebo data (soubory), jichž není
                                    autorem a nemá k nakládání s nimi písemný souhlas jejich autora či vlastníka práv k
                                    nim. Poskytovatel je oprávněn si v případě podezření z porušování tohoto zákazu
                                    vyžádat od Zákazníka písemné potvrzení, že je oprávněn takto činit. Zákazník je
                                    povinen toto potvrzení Provozovateli dodat bez zbytečných odkladů. Jestliže Zákazník
                                    toto potvrzení nedodá, je Provozovatel oprávněn službu omezit, pozastavit či sporná
                                    data (soubory) smazat. Rozhodnutí o souladu využití služby a těchto smluvních
                                    podmínek je výhradně na uvážení Provozovatele.
                                    Provozovatel je oprávněn zkoumat data (soubory) zákazníka, pokud pojme podezření, že
                                    jsou tato data (soubory) v rozporu s těmito podmínkami.
                                    Zákazník odpovídá za veškerou škodu způsobenou Provozovateli, jeho dalším Zákazníkům
                                    nebo třetím stranám.
                                    Provozovatel je oprávněn omezit provoz služby v případě, že Zákazník pro jejich
                                    provoz využívá nevhodné softwarové prostředky či nejsou vhodně nastavené.
                                    Provozovatel je oprávněn v případě opakovaného porušování zákonů České republiky s
                                    okamžitou platností ukončit provoz veškerých služeb zákazníka a zablokování přístupu
                                    k administraci jeho účtu do ukončení vyšetřování Policie ČR případně jiného orgánu
                                    státní moci k tomu oprávněnému.
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant={"h3"} style={{margin: "1em"}}>
                            6. Ochrana informací a ochrana osobních údajů
                        </Typography>
                        <Grid container justify={"center"}>
                            <Grid item xs={10}>
                                <Typography component={"p"} paragraph align={"left"}>
                                    Provozovatel i Zákazník se zavazují k mlčenlivosti o skutečnostech, které se
                                    vzájemně dozvěděli v souvislosti se zřízením a provozem služeb.
                                    Ochrana informací se nevztahuje na případ, kdy má Poskytovatel informační povinnost
                                    stanovenou zákonem resp. kdy si informace vyžádají státní orgány oprávněné k tomu
                                    zákonem, nebo jde o informace, které jsou veřejně dostupné.
                                    Zákazník souhlasí se zpracováním svých osobních údajů Provozovatelem ve smyslu
                                    zákona č. 101/2000 Sb., o ochraně osobních údajů.
                                    Poskytovatel se zavazuje zabezpečit ochranu osobních údajů před neoprávněným nebo
                                    nahodilým přístupem, zabránit jejich změně, ztrátě či zničení, neoprávněnému přenosu
                                    či jejich jinému neoprávněnému zpracování, jakož i jinému zneužití.
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant={"h3"} style={{margin: "1em"}}>
                            7. Závěrečná ustanovení
                        </Typography>
                        <Grid container justify={"center"}>
                            <Grid item xs={10}>
                                <Typography component={"p"} paragraph align={"left"}>
                                    Veškerá ujednání mezi Provozovatelem a Zákazníkem se řídí platným a účinným českým
                                    právním řádem. Provozovatel může kteroukoli část Smlouvy nebo smluvních podmínek
                                    změnit kdykoli, a to s platností a účinností od prvního dne následujícího
                                    kalendářního měsíce po zveřejnění změn. Zachováním provozu svých služeb i po změně
                                    Smlouvy, Podmínek, smluvních podmínek či dalších souvisejících dokumentů, dává
                                    Zákazník najevo svůj jednoznačný souhlas s novým zněním těchto dokumentů a jejich
                                    plnou akceptaci při provozu svých služeb.
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant={"h3"} style={{margin: "1em"}}>

                        </Typography>
                        <Grid container justify={"center"}>
                            <Grid item xs={10}>
                                <Typography component={"p"} paragraph align={"left"}>
                                    V případě, že dojde mezi námi a spotřebitelem ke vzniku spotřebitelského sporu z
                                    kupní smlouvy nebo ze smlouvy o poskytování služeb, který se nepodaří vyřešit
                                    vzájemnou dohodou, může spotřebitel podat návrh na mimosoudní řešení takového sporu
                                    určenému subjektu mimosoudního řešení spotřebitelských sporů, kterým je

                                    Česká obchodní inspekce
                                    Ústřední inspektorát – oddělení ADR
                                    Štěpánská 15
                                    120 00 Praha 2

                                    Email: adr@coi.cz
                                    Web: adr.coi.cz
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}