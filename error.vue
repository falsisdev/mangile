<template>
    <navbar/>
    <div :data-theme="route.query.theme ? route.query.theme == 'none' ? runtimeConfig.public.theme : route.query.theme : runtimeConfig.public.theme" class="grid grid-rows-1 grid-cols-6"><!--grid-->
        <leftmenu/>
        <div class="col-span-2 col-start-2 col-end-6 p-5"><!--page view-->
            <article class="prose max-w-none">
                <h1>Görünüşe göre bir hata ile karşılaştık.</h1>
                <p>
                Görünüşe göre bir hata ile karşılaştık. Aslına bakarsanız, bu hatanın kaynağını kesin olarak bilmiyoruz. Eğer siz de bu hatanın kaynağını kesin olarak bilmiyorsanız, bunu <NuxtLink class="link link-primary">iletişim</NuxtLink> adreslerimizden bize bildirin.<br/>
                Hatanızın sebepleri şunlar olabilir:<br/>
                <NuxtLink class="flex justify-end" style="text-decoration: none;" to="/"><button class="btn btn-secondary">Ana Sayfa</button></NuxtLink>
                </p>
                <div class="overflow-x-auto">
                        <table class="table table-zebra w-full">
                            <!-- head -->
                            <thead>
                            <tr>
                                <th></th>
                                <th>Hata Kodu</th>
                                <th>Açıklama</th>
                                <th>Sebep olabilecek durumlar</th>
                            </tr>
                            </thead>
                            <tbody>
                            <!-- row 1 -->
                            <tr>
                                <th>1</th>
                                <td>203</td>
                                <td>Yetersiz Bilgi</td>
                                <td>Doldurulan formdaki bilgilerin yetersiz kalması veya sistemler arası etkileşimde yetersiz bilgi girişi</td>
                            </tr>
                            <!-- row 2 -->
                            <tr>
                                <th>2</th>
                                <td>204</td>
                                <td>İçerik Yok</td>
                                <td>Aradığınız içerik sistemde yer almıyor veya sistemler arası etkileşimlerde cevap boş döndürülür</td>
                            </tr>
                            <!-- row 3 -->
                            <tr>
                                <th>3</th>
                                <td>301</td>
                                <td>Kalıcı Taşındı</td>
                                <td>Aradığınız sayfa artık orada değil veya sistemler arası etkileşimde aranan sayfa kalıcı olarak taşınmış</td>
                            </tr>
                            <!-- row 4 -->
                            <tr>
                                <th>4</th>
                                <td>302</td>
                                <td>Geçişi Taşındı</td>
                                <td>Aradığınız sayfa bir süre orada olmayacak veya sistemler arası etkileşimde aranan sayfa geçici olarak taşınmış</td>
                            </tr>
                            <!-- row 5 -->
                            <tr>
                                <th>5</th>
                                <td>400</td>
                                <td>Kötü İstek</td>
                                <td>İstediğiniz parametre geçersiz veya sistemler arası etkileşimde verilen geçersiz dönüt</td>
                            </tr>
                            <!-- row 6 -->
                            <tr>
                                <th>6</th>
                                <td>401</td>
                                <td>Yetkisiz</td>
                                <td>Erişmeye çalıştığınız sayfa için yeterli yetkiniz yok veya sistmeler arası etkileşimde izinsiz giriş tespiti</td>
                            </tr>
                            <!-- row 7 -->
                            <tr>
                                <th>7</th>
                                <td>402</td>
                                <td>Ödeme Gerekli</td>
                                <td>Aradığınız sayfa ücret gerektiriyor veya erişilmek istenen sistem ücretli</td>
                            </tr>
                            <!-- row 8 -->
                            <tr>
                                <th>8</th>
                                <td>403</td>
                                <td>Yasaklandı</td>
                                <td>Erişilmek istenen sayfa yasaklanmış</td>
                            </tr>
                            <!-- row 9 -->
                            <tr>
                                <th>9</th>
                                <td>404</td>
                                <td>Sayfa Bulunamadı</td>
                                <td>Aradığınız sayfa bulunamadı veya sistemler arası iletişimde aranan sayfa bulunamadı</td>
                            </tr>
                            <!-- row 10 -->
                            <tr>
                                <th>10</th>
                                <td>405</td>
                                <td>İzin Verilmeyen Yöntem</td>
                                <td>Erişilmek istenen sistemde gönderilen erişim isteğinin yöntemi geçersiz</td>
                            </tr>
                            <!-- row 11 -->
                            <tr>
                                <th>11</th>
                                <td>409</td>
                                <td>Çakışma</td>
                                <td>Gönderilen istek başka bir istekle çakışıyor</td>
                            </tr>
                            <!-- row 12 -->
                            <tr>
                                <th>12</th>
                                <td>415</td>
                                <td>Desteklenmeyen Medya Türü</td>
                                <td>Erişilmek istenen medya türü desteklenmiyor</td>
                            </tr>
                            <!-- row 13 -->
                            <tr>
                                <th>13</th>
                                <td>500</td>
                                <td>İç Sunucu Hatası</td>
                                <td>Erişilmek istenen sayfanın sunucusunda bir hata var</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </article>
        </div>
    </div>
</template>
<script setup>
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
</script>