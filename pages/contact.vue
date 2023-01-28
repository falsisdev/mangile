<template>
    <navbar/>
        <div class="grid grid-rows-1 grid-cols-6"><!--grid-->
        <leftmenu/>
        <div class="col-span-2 col-start-2 col-end-6 p-5"><!--page view-->
        <article class="prose max-w-none">
            <h1>İletişim Adreslerimiz</h1>
        </article><br>
        <article class="prose max-w-none">
            <p>
                Aşağıda bazı Mangile iletişim adresleri verilmiştir. Lütfen bu adresleri gereksiz yere meşgul etmeyin. Eğer e-posta adresini gereksiz yere meşgul ederseniz adresten banlanır ve bir daha aynı postanızla bize ulaşamazsınız. Discord sunucusu ise kendine ait kuralları mevcuttur ve 
                Mangile'a özel bir sunucu değildir. Disiplin ve düzen için lütfen bu hususlara dikkat edin.
            </p>
        </article><br/>
        <article class="prose max-w-none">
            <h2>Discord Sunucusu</h2>
        </article><br/>
        <div class="flex flex-row flex-wrap">
            <div class="card card-compact w-96 bg-base-100 shadow-xl">
            <figure><img src="https://cdn.discordapp.com/attachments/775822548519616562/1068883023963107379/kremlinbanner1.1.jpg" /></figure>
            <div class="card-body">
                <h2 class="card-title">        
                    <div class="avatars absolute pb-20">
                    <div class="w-24 mask mask-squircl">
                        <img src="https://cdn.discordapp.com/attachments/775822548519616562/1068883024256716940/20220523_212620.jpg" />
                    </div>
                    </div>
                </h2><br/>
                <p>Mangile destek için kullanılan ve aslında geliştiricilere destek için açılmış Kremlin Geliştirici topluluğu Discord sunucusuna aşağıdaki buton aracılığıyla katılabilirsiniz.</p>
                <div class="card-actions justify-end">
                <a href="https://discord.gg/BDXkSgVaXe"><button class="btn btn-primary"><span class="pr-2"><font-awesome-icon icon="fa-solid fa-right-to-bracket" /></span>Katıl</button></a>
                </div>
            </div>
            </div>
            <div class="card card-compact w-96 bg-base-100 shadow-xl">
            <figure><img src="https://cdn.discordapp.com/attachments/775822548519616562/1068908750129348668/image.png" /></figure>
            <div class="card-body">
                <h2 class="card-title">        
                    <div class="avatars absolute pb-20">
                    <div class="w-24 mask mask-squircl">
                        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />
                    </div>
                    </div>
                </h2><br/>
                <p>Eğer Mangile websitesinde bazı sorunlar yaşıyorsanız bize en hızlı ulaşabileceğiniz yer olan Github Issues bölümüne aşağıdaki butona tıklayarak ulaşabilirsiniz.</p>
                <div class="card-actions justify-end">
                <a href="https://github.com/falsisdev/mangile/issues"><button class="btn btn-primary"><span class="pr-2"><font-awesome-icon icon="fa-solid fa-link" /></span>Github</button></a>
                </div>
            </div>
            </div>
            </div><br/>
        <article class="prose max-w-none">
            <h2>E-Posta Adresi</h2>
            <p>E-Posta Adresimiz: falsis@proton.me</p>
            Bizimle e-posta aracılığıyla iletişime geçmek için <a href="mailto: falsis@proton.me"><button class="btn m-2"><span class="pr-2"><font-awesome-icon icon="fa-solid fa-envelope" /></span>E-Posta Gönder</button></a> butonunu kullanabilirsiniz.
        </article><br/>
        </div>
        </div>
    </template>