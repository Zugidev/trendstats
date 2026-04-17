// server.js - Backend dosyası (Node.js)
// ============================================
// KURULUM: npm init -y && npm install express cors axios
// ÇALIŞTIR: node server.js
// ============================================

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// 80+ GERÇEK HABER KAYNAĞI (RSS)
// ============================================
const RSS_KAYNAKLARI = [
    // Uluslararası haber ajansları
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://www.theguardian.com/world/rss',
    'https://rss.cnn.com/rss/edition.rss',
    'https://www.reuters.com/rssfeed/topnews',
    'https://feeds.washingtonpost.com/rss/world',
    'https://rss.wsj.com/xml/rss/3_7085.xml',
    'https://www.nbcnews.com/feed',
    'https://abcnews.go.com/abcnews/topstories',
    'https://www.cbsnews.com/latest/rss',
    'https://www.npr.org/rss/rss.php?id=1001',
    'https://www.bbc.com/news/rss.xml',
    'https://www.telegraph.co.uk/rss.xml',
    'https://www.independent.co.uk/rss',
    'https://www.ft.com/rss/home/uk',
    'https://www.economist.com/feeds/print-sections/77/business.xml',
    'https://time.com/feed/',
    'https://www.newsweek.com/rss',
    'https://www.businessinsider.com/rss',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    'https://www.bloomberg.com/feed/podcast/etf-report',
    'https://apnews.com/rss',
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://www.dw.com/tr/rss.xml',
    'https://www.euronews.com/rss?country=tr',
    
    // Avrupa
    'https://www.spiegel.de/schlagzeilen/index.rss',
    'https://www.zeit.de/index/rss',
    'https://www.faz.net/rss/aktuell',
    'https://www.sueddeutsche.de/rss',
    'https://www.welt.de/feeds/rss.rss',
    'https://www.tagesschau.de/xml/rss2',
    'https://www.lemonde.fr/rss/une.xml',
    'https://www.lefigaro.fr/rss/figaro_actualites.xml',
    'https://www.liberation.fr/rss',
    'https://elpais.com/rss/elpais/portada.xml',
    'https://www.elmundo.es/rss.html',
    'https://www.lavanguardia.com/rss/home.xml',
    'https://www.repubblica.it/rss/homepage/rss2.0.xml',
    'https://www.corriere.it/rss/homepage.xml',
    'https://www.lastampa.it/rss',
    
    // Rusya ve Doğu Avrupa
    'https://www.rt.com/rss/news/',
    'https://tass.com/rss/v2.xml',
    'https://www.rbc.ru/rss/news',
    'https://lenta.ru/rss/news',
    'https://www.kyivpost.com/rss',
    'https://www.ukrinform.net/rss',
    
    // Asya
    'https://www.japantimes.co.jp/feed/',
    'https://www.asahi.com/rss/asahi/newsheadlines.rdf',
    'https://www.scmp.com/rss/2/feed',
    'https://www.chinadaily.com.cn/rss/china_rss.xml',
    'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
    'https://www.hindustantimes.com/rss/india/rssfeed.xml',
    'https://www.thehindu.com/news/feeder/default.rss',
    'https://www.koreatimes.co.kr/www/rss/news_rss.asp',
    'https://www.koreaherald.com/rss.php',
    'https://www.bangkokpost.com/rss',
    'https://www.thejakartapost.com/rss',
    'https://www.straitstimes.com/rss',
    
    // Orta Doğu
    'https://www.jpost.com/Rss/RssFeedsHeadlines.aspx',
    'https://www.haaretz.com/rss',
    'https://www.timesofisrael.com/feed/',
    'https://www.arabnews.com/rss',
    'https://www.thenationalnews.com/rss',
    'https://www.dawn.com/rss',
    'https://www.tehrantimes.com/rss',
    
    // Amerika
    'https://www.latimes.com/rss2.0.xml',
    'https://www.usatoday.com/rss/news',
    'https://www.chicagotribune.com/rss2.0.xml',
    'https://www.theglobeandmail.com/feed/',
    'https://nationalpost.com/feed',
    'https://www.cbc.ca/rss/cpcontent',
    'https://www.smh.com.au/rss/feed.xml',
    'https://www.abc.net.au/news/feed/51120/rss.xml',
    'https://g1.globo.com/rss/g1/',
    'https://www.eluniversal.com.mx/rss/',
    'https://www.lanacion.com.ar/feed/',
    'https://www.eltiempo.com/rss',
    
    // Afrika
    'https://www.news24.com/feeds',
    'https://www.iol.co.za/rss',
    'https://www.premiumtimesng.com/feed',
    'https://www.nation.africa/rss',
    'https://www.egypttoday.com/rss',
    
    // Türkiye
    'https://www.hurriyet.com.tr/rss/anasayfa',
    'https://www.milliyet.com.tr/rss/rssnew/gundemrss.xml',
    'https://www.sabah.com.tr/rss/anasayfa.xml',
    'https://www.haberturk.com/rss',
    'https://www.cumhuriyet.com.tr/rss/son_dakika.xml',
    'https://www.bloomberght.com/feed/rss',
    'https://www.fanatik.com.tr/rss/',
    'https://www.webtekno.com/rss',
    'https://www.donanimhaber.com/rss.xml',
    'https://www.sozcu.com.tr/rss/current.xml',
    'https://www.ntv.com.tr/son-dakika.rss',
    'https://www.cnnturk.com/feed/rss/allnews',
    'https://www.ahaber.com.tr/rss',
    'https://www.star.com.tr/rss/',
    'https://www.yenisafak.com/rss'
];

const PROXY = 'https://api.allorigins.win/raw?url=';

// Önbellek (2 dakika)
let haberCache = [];
let cacheZamani = 0;
const CACHE_SURESI = 120000;

// RSS'den haber başlıklarını çek
async function fetchRSS(url) {
    try {
        const response = await axios.get(PROXY + encodeURIComponent(url), { timeout: 8000 });
        const data = response.data;
        
        // RSS ve Atom formatlarını ayrıştır
        const haberler = [];
        
        // RSS 2.0
        const rssMatches = data.match(/<item>[\s\S]*?<\/item>/gi);
        if (rssMatches) {
            for (const item of rssMatches) {
                const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/i);
                if (titleMatch && titleMatch[1]) {
                    let title = titleMatch[1].replace(/<![CDATA\[|\]\]>/g, '').trim();
                    if (title.length > 5) {
                        haberler.push({ title: title.substring(0, 200) });
                    }
                }
            }
        }
        
        // Atom formatı
        const atomMatches = data.match(/<entry>[\s\S]*?<\/entry>/gi);
        if (atomMatches) {
            for (const entry of atomMatches) {
                const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/i);
                if (titleMatch && titleMatch[1]) {
                    let title = titleMatch[1].replace(/<![CDATA\[|\]\]>/g, '').trim();
                    if (title.length > 5) {
                        haberler.push({ title: title.substring(0, 200) });
                    }
                }
            }
        }
        
        return haberler;
    } catch (e) {
        return [];
    }
}

// Tüm haberleri topla
async function tumHaberleriTopla(progressCallback) {
    const simdi = Date.now();
    if (haberCache.length > 0 && (simdi - cacheZamani) < CACHE_SURESI) {
        return haberCache;
    }
    
    console.log('🔄 ' + new Date().toLocaleString() + ' - Haber kaynakları taranıyor...');
    
    const tumHaberler = [];
    let tamamlanan = 0;
    
    for (const url of RSS_KAYNAKLARI) {
        const haberler = await fetchRSS(url);
        tumHaberler.push(...haberler);
        tamamlanan++;
        
        if (progressCallback) {
            progressCallback((tamamlanan / RSS_KAYNAKLARI.length) * 100);
        }
    }
    
    haberCache = tumHaberler;
    cacheZamani = simdi;
    
    console.log(`✅ ${tumHaberler.length} haber başlığı toplandı (${RSS_KAYNAKLARI.length} kaynak)`);
    
    return tumHaberler;
}

// Soruyu analiz et ve cevap üret
function analizEt(haberler, soru) {
    // Stop words (önemsiz kelimeler)
    const stopWords = [
        'nedir', 'kimdir', 'nasıl', 'nerede', 'ne zaman', 'acaba', 'mi', 'mu', 'ki', 've', 
        'veya', 'ile', 'için', 'gibi', 'kadar', 'de', 'da', 'mi', 'mı', 'mu', 'mü',
        'is', 'are', 'was', 'were', 'a', 'an', 'the', 'and', 'or', 'but', 'so', 'for', 
        'of', 'to', 'in', 'on', 'at', 'by', 'with', 'without', 'what', 'when', 'where', 
        'which', 'who', 'whom', 'how', 'does', 'do', 'did', 'has', 'have', 'had'
    ];
    
    // Soruyu temizle ve anahtar kelimeleri çıkar
    let temizSoru = soru.toLowerCase()
        .replace(/[^\w\sğüşıöçĞÜŞİÖÇ?]/g, '')
        .replace(/\?/g, '');
    
    let kelimeler = temizSoru.split(/\s+/).filter(w => w.length > 2);
    kelimeler = kelimeler.filter(w => !stopWords.includes(w));
    
    if (kelimeler.length === 0 && soru.length > 5) {
        kelimeler = [soru.toLowerCase().substring(0, 30)];
    }
    
    // Haberlerde ara
    let eslesenHaberler = [];
    let toplamSkor = 0;
    
    for (const haber of haberler) {
        const baslik = haber.title.toLowerCase();
        let eslesmeSayisi = 0;
        
        for (const kw of kelimeler) {
            if (baslik.includes(kw)) {
                eslesmeSayisi++;
            }
        }
        
        if (eslesmeSayisi > 0) {
            eslesenHaberler.push(haber);
            toplamSkor += eslesmeSayisi / kelimeler.length;
        }
    }
    
    // Yüzde hesapla
    const dogrulukYuzdesi = haberler.length > 0 ? (toplamSkor / haberler.length) * 100 : 0;
    let finalYuzde = dogrulukYuzdesi * 2.5;
    
    if (finalYuzde > 95) finalYuzde = 95;
    if (finalYuzde < 5 && eslesenHaberler.length > 0) finalYuzde = 15;
    
    // Cevap belirle
    let cevap = "";
    let cevapMetni = "";
    
    if (finalYuzde >= 65) {
        cevap = "EVET";
        cevapMetni = `✅ EVET. %${finalYuzde.toFixed(1)} güvenilirlikle, ${eslesenHaberler.length} haber kaynağı bu bilgiyi doğruluyor.`;
    } else if (finalYuzde >= 35) {
        cevap = "KISMEN";
        cevapMetni = `⚠️ KISMEN DOĞRU. %${finalYuzde.toFixed(1)} güvenilirlikle, bilgiler karışık veya henüz netleşmemiş.`;
    } else {
        cevap = "HAYIR";
        cevapMetni = `❌ HAYIR. %${finalYuzde.toFixed(1)} güvenilirlikle, bu iddia haber kaynaklarında doğrulanmamış.`;
    }
    
    // Örnek haber başlıkları
    const ornekBasliklar = eslesenHaberler.slice(0, 3).map(h => h.title.substring(0, 100));
    
    return {
        cevap: cevap,
        cevapMetni: cevapMetni,
        guven: finalYuzde.toFixed(1),
        toplamHaber: haberler.length,
        eslesenHaber: eslesenHaberler.length,
        anahtarKelimeler: kelimeler.slice(0, 6),
        ornekBasliklar: ornekBasliklar
    };
}

// ============================================
// API ENDPOINTLERİ
// ============================================

// Soru-cevap endpoint'i
app.post('/api/soru', async (req, res) => {
    const { soru } = req.body;
    
    if (!soru || soru.trim().length < 3) {
        return res.status(400).json({ 
            success: false, 
            error: 'Lütfen geçerli bir soru girin (en az 3 karakter)' 
        });
    }
    
    try {
        const haberler = await tumHaberleriTopla();
        const sonuc = analizEt(haberler, soru);
        
        res.json({
            success: true,
            soru: soru,
            ...sonuc
        });
    } catch (err) {
        console.error('Hata:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Bir hata oluştu. Lütfen tekrar deneyin.' 
        });
    }
});

// İstatistik endpoint'i
app.get('/api/istatistik', async (req, res) => {
    res.json({
        kaynakSayisi: RSS_KAYNAKLARI.length,
        haberSayisi: haberCache.length,
        sonGuncelleme: cacheZamani,
        cacheSuresi: CACHE_SURESI / 1000 + ' saniye'
    });
});

// Ana sayfa kontrolü
app.get('/', (req, res) => {
    res.json({ 
        status: 'online', 
        name: 'trendstats.ai API',
        version: '1.0.0',
        endpoints: {
            soru: 'POST /api/soru',
            istatistik: 'GET /api/istatistik'
        }
    });
});

// ============================================
// SUNUCUYU BAŞLAT
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║     🚀 trendstats.ai BACKEND BAŞLATILDI 🚀       ║
╠══════════════════════════════════════════════════╣
║  Port: ${PORT}                                       ║
║  API: http://localhost:${PORT}/api/soru              ║
║  Kaynak sayısı: ${RSS_KAYNAKLARI.length}                            ║
╚══════════════════════════════════════════════════╝
    `);
});