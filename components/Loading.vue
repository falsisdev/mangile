<script setup>
const props = defineProps({
    what: String,
    type: String
})

const infos = [
    "Mangile geliştirilmeye 2022'nin üçüncü çeyreğinde başlanmıştır.",
    "Mangile geliştirilmeye başlandığında tek geliştirici Falsis henüz 15 yaşında bir 9. sınıf öğrencisiydi. Şu sıralar üniversitede.",
    "Mangile'ın geliştirilmesine ilham veren web sitesi MangaDex'tir.",
    "Falsis, Mangile'ı geliştirmeden önce Ani+ adında bir anime sitesi denemesi yapıp vazgeçmişti.",
    "Mangile geliştirilmeye başlandığında 1 Dolar 18 Liraydı.",
    "Hunter x Hunter: Togashi hastalığı sebebiyle seriye uzun süreli ara verdiğinde, eşi -Sailor Moon'un mangakası- seriyi çizmeye kendisinin devam edebileceğini önermesine rağmen Togashi bunu reddetmiştir.",
    "Sword Art Online: Yazar Reki Kawahara, bu efsanevi seriyi aslında 2002 yılında bir ödüllü yarışma için yazdı ancak kelime sınırı çok uzun olduğu için yarışmaya katılamayıp web sitesinde yayımladı.",
    "Overlord: Serinin yazarı, masaüstü rol yapma oyunu (D&D) oynayacak arkadaş bulamadığı için sıkıntıdan bu devasa fantastik dünyayı yazmaya başladı.",
    "Tensura: Ana karakter Rimuru'nun slime (balçık) olarak doğmasının sebebi, yazarın fantastik oyunlardaki en zayıf yaratığı en güçlü yapma arzusuydu.",
    "Re:Zero: Ana karakter Subaru'nun her öldüğünde zamanda geri dönme gücü, yazar Tappei Nagatsuki'nin eski bilgisayar oyunlarındaki 'kayıt noktası' (save point) sisteminden ilham almasıyla ortaya çıktı.",
    "One Piece: Serinin yazarı Eiichiro Oda, seriyi 1997 yılında Weekly Shonen Jump dergisinde yayımlamaya başladığında sadece 22 yaşındaydı.",
    "KonoSuba: Yazar Natsume Akatsuki, seriyi web romanı olarak yazarken asıl işi olan gece bekçiliğinde sıkılmamak için bölümleri akıllı telefonundan kaleme alıyordu.",
    "Attack on Titan: Yazar Hajime Isayama, Titanların insanları korkutmadan kontrolsüzce hareket etme fikrini, internet kafede çalışırken karşılaştığı sarhoş ve ne yapacağı belirsiz bir müşteriden aldı.",
    "Naruto: Masashi Kishimoto, seriyi ilk tasarladığında Naruto bir ninja değil, sihirli bir tilkiydi ve hikaye büyü dünyasında geçiyordu; editörünün tavsiyesiyle ninjaya dönüştürüldü.",
    "Bleach: Tite Kubo, seriyi ilk tasarladığında ana karakter Ichigo bir kızdı ve hikaye modern bir şehirde geçiyordu; editörünün tavsiyesiyle erkek karaktere dönüştürüldü.",
    "Bleach: Yazar Tite Kubo'nun seriye 'Bleach' (Çamaşır Suyu) adını vermesinin sebebi, siyah giyen Shinigamiler (Ölüm Tanrıları) ile kontrast oluşturacak beyaz rengi ve 'temizleme' fikrini sembolize etmek istemesiydi.",
    "Jujutsu Kaisen: Gege Akutami, popüler karakter Satoru Gojo'yu bilerek o kadar güçlü tasarladı ki, daha sonra hikayeyi ilerletmekte zorlandığı için sürekli onu mühürlemenin yollarını aradı.",
    "Demon Slayer (Kimetsu no Yaiba): Manganın ikonik kötü karakteri Muzan Kibutsuji'nin tasarımı, yazar Koyoharu Gotouge tarafından pop müziğin efsane kralı Michael Jackson'dan esinlenilerek çizildi.",
    "Chainsaw Man: Tatsuki Fujimoto, seriyi çizerken tek amacının popüler Shonen klişelerini yıkmak ve okuyucuya 'asla tahmin edemeyeceği' absürt şoklar yaşatmak olduğunu söylüyor.",
    "Dragon Ball: Efsanevi mangaka Akira Toriyama, serideki karakterlerin saçlarını sürekli 'Süper Saiyan' formunda sarıya (mangada beyaza) boyadı, çünkü her panelde siyah saç boyamaktan çok sıkılmıştı.",
    "My Hero Academia: Ana karakter Deku ilk taslaklarda hiçbir gücü olmayan, sadece teknolojik aletler kullanan yetişkin bir dedektifti; editör ısrarıyla liseli bir gence dönüştürüldü.",
    "JoJo's Bizarre Adventure: Hirohiko Araki, karakterlerin ikonik ve anatomik olarak imkansız olan 'JoJo Pozları'nı tasarlarken 80'lerin ünlü moda dergilerinden ve Versace reklamlarından ilham aldı.",
    "No Game No Life: Yazar Yuu Kamiya, serinin hem hikayesini yazıp hem de çizimlerini tek başına yaparken ağır bir mide rahatsızlığı geçirmiş, buna rağmen hastane odasında serumla çizim yapmaya devam etmiştir.",
    "Mushoku Tensei: Modern İsekai türünün babası sayılan bu serinin yazarı Rifujin na Magonote, ana karakterin geçmişteki ezik hayatını bilerek çok itici tasarlamıştır ki karakter gelişiminin büyüklüğü daha iyi anlaşılsın.",
    "One-Punch Man: Serinin orijinal çizeri ONE, dijital çizim tabletini ilk aldığında sadece deneme yapmak ve çizim programını öğrenmek için Saitama karakterini tek bir yuvarlak olarak tasarlamıştır.",
    "Tokyo Ghoul: Yazar Sui Ishida, serinin yayımlandığı yıllar boyunca gerçek yüzünü, cinsiyetini ve kimliğini herkesten saklamış, hayranlarıyla sadece çizdiği bir avatar üzerinden iletişim kurmuştur.",
    "Hunter x Hunter: Serideki meşhur 'Ging Freecss' karakteri, yazarın bizzat kendi babasıyla olan kopuk ilişkisinden ve babasını bir türlü bulamayışından ilham alınarak yaratılmıştır.",
    "Berserk: Efsanevi mangaka Kentaro Miura, Guts'ın devasa kılıcı 'Dragon Slayer'ı tasarlarken, geleneksel şövalye 'kılıçlarının fantastik canavarları kesmek için çok hafif kalacağını düşünmüştür.",
    "Vinland Saga: Yazar Makoto Yukimura, Vikinglerin vahşetini o kadar derinden hissetmiştir ki serinin ilerleyen bölümlerinde ana karakter Thorfinn'e 'Hiç kimsenin düşmanı yoktur' dedirterek seriyi bir barış hikayesine çevirmiştir.",
    "Death Note: Ölüm Defteri'ne isim yazarken kullanılan tüy kalemler, çizer Takeshi Obata tarafından kasıtlı olarak tırpan (ölüm meleği sembolü) şeklinde hareket edecek şekilde resmedilmiştir.",
    "Spy x Family: Yazar Tatsuya Endo aslında çok karanlık ve trajik hikayeler yazmak istiyordu; editörü zorla komedi yazdırdığı için Anya ve Bond karakterlerini isteksizce ekledi ancak seri bu sayede küresel bir hit oldu.",
    "Mob Psycho 100: Ana karakter Mob'un duyguları %100'e ulaştığında patlaması, yazarın günlük hayatta içine attığı stresin ve bastırılmış duyguların bir yansımasıdır.",
    "The Rising of the Shield Hero: Ana karakter Naofumi'nin sadece kalkan kullanabilmesi, yazarın oyunlarda herkesin hasar vermeye odaklanıp kimsenin 'Tank' rolünü seçmemesine sinirlenmesiyle ortaya çıkmıştır.",
    "Log Horizon: Yazar Mamare Touno, serideki oyun içi ekonomiyi o kadar gerçekçi tasarlamıştır ki kendisi gerçek hayatta vergi kaçakçılığından gözaltına alınmıştır.",
    "Blue Lock: Serinin yazarı Muneyuki Kaneshiro, Japonya Milli Takımı'nın Dünya Kupası'ndaki gerçek maç taktiklerini ve oyuncularını mangada açıkça eleştirerek futbol dünyasında büyük tartışma yaratmıştır.",
    "Kaguya-sama: Love is War: Yazar Aka Akasaka, dahi karakterlerin aşk savaşını yazarken o kadar çok bilgisayar oyunu (Apex Legends) oynuyordu ki bazen yeni bölümün çıkması oyun turnuvaları yüzünden erteleniyordu.",
    "The Promised Neverland: Serinin çizeri Posuka Demizu, çocukların yetimhaneden kaçış planlarını çizerken daha gerçekçi açılar yakalayabilmek için evinde Lego parçalarıyla yetimhanenin maketini inşa etmiştir.",
    "Ekibimiz tek kişiliktir."
]
</script>
<template>
    <main class="flex flex-col items-center justify-center">
        <svg class="w-12 h-12 text-primary mb-2 animate-spin" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from SVG Spinners by Utkarsh Verma - https://github.com/n3r4zzurr0/svg-spinners/blob/main/LICENSE --><path fill="#ffffff" d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        <span v-if="props.type == 'default'" class="opacity-75 text-sm">{{ props.what || '' }} Yükleniyor...</span>
        <p v-if="props.type == 'app'" class="mt-4 text-lg text-primary font-semibold">Bunu Biliyor Muydunuz?</p>
        <p v-if="props.type == 'app'" class="text-md text-primary"> {{ infos[Math.floor(Math.random() * infos.length)]
        }}</p>
    </main>
</template>