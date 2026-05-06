/**
 * HSV 수치를 기반으로 곶자왈 앰비언트 MusicGen 프롬프트를 생성하는 함수
 * @param {number} h - Hue (색상): 0 ~ 360
 * @param {number} s - Saturation (채도): 0 ~ 100 (%)
 * @param {number} v - Value (명도): 0 ~ 100 (%)
 * @param {boolean} hasAudio - 주변 소리 녹음 파일 첨부 여부 (기본값: false)
 * @returns {string} 완성된 MusicGen 텍스트 프롬프트
 */
function generateMusicGenPrompt(h, s, v, hasAudio = false) {
    // 1. 기본 테마 설정 (곶자왈 고정)
    const baseTheme = "Ambient nature music set in a Jeju Gotjawal forest";
    
    let tagEmotion = "";
    let tagBPMTexture = "";
    let tagInstruments = "";

    // 2. 색상(Hue)에 따른 감정 및 분위기 묘사 매핑
    if ((h >= 0 && h < 30) || (h >= 330 && h <= 360)) {
        // Red 계열: 생기있고 약간 신비로운 에너지
        tagEmotion = "vibrant, lively, subtle mystical energy";
    } else if (h >= 30 && h < 90) {
        // Yellow/Brown 계열: 따뜻하고 햇빛이 비치는 희망찬 분위기
        tagEmotion = "warm, sunlit, hopeful and gentle atmosphere";
    } else if (h >= 90 && h < 150) {
        // Green 계열 (주요 곶자왈 색상): 평화롭고 치유되는 울창한 숲
        tagEmotion = "peaceful, healing, serene and lush environment";
    } else if (h >= 150 && h < 210) {
        // Cyan/Blue-Green 계열: 공기감이 느껴지고 안개 낀 차분함
        tagEmotion = "airy, misty, refreshing and calm";
    } else if (h >= 210 && h < 270) {
        // Blue/Dark 계열: 신비롭고 우울하며 깊고 엄숙한 분위기
        tagEmotion = "mysterious, melancholic, deep and solemn mood";
    } else if (h >= 270 && h < 330) {
        // Purple/Pink 계열: 몽환적이고 비현실적인 풍경
        tagEmotion = "dreamy, ethereal, surreal landscape";
    } else {
        // 예외 처리 (기본값)
        tagEmotion = "peaceful, healing, serene and lush environment";
    }

    // 3. 채도(Saturation)에 따른 BPM 및 텍스처(음의 길이) 매핑
    if (s >= 0 && s < 30) {
        // 낮은 채도 (탁함/안개): 끊어지는 소리, 여백이 많은 중간 템포
        tagBPMTexture = "moderate tempo around 80 BPM, sparse and delicate staccato textures, airy";
    } else if (s >= 30 && s < 70) {
        // 중간 채도: 부드러운 리듬감과 느린 템포
        tagBPMTexture = "slow tempo around 65 BPM, gentle rhythmic movement";
    } else if (s >= 70 && s <= 100) {
        // 높은 채도 (선명함): 매우 느리고 끊임없이 이어지는 긴 패드(드론) 사운드
        tagBPMTexture = "very slow tempo around 50 BPM, long sustained drone, continuous flowing textures";
    } else {
        // 예외 처리 (기본값)
        tagBPMTexture = "slow tempo around 65 BPM, gentle rhythmic movement";
    }

    // 4. 명도(Value)에 따른 악기 구성 및 다이내믹스(음량) 매핑
    if (v >= 0 && v < 30) {
        // 낮은 명도 (어두움/그림자): 조용한 피아노, 베이스 등 속삭이듯 작은 볼륨
        tagInstruments = "featuring sparse muted piano, low distant bass, extremely soft and whispery volume, muffled sounds";
    } else if (v >= 30 && v < 70) {
        // 중간 명도: 어쿠스틱 기타, 부드러운 현악기, 날것의 자연스러운 프로덕션
        tagInstruments = "featuring soft acoustic guitar, gentle strings, organic and raw production";
    } else if (v >= 70 && v <= 100) {
        // 높은 명도 (밝음/햇빛): 크고 풍성한 신디사이저 패드, 화려한 오케스트라 현악기, 뚜렷한 다이내믹스
        tagInstruments = "featuring bright and lush synthesizer pads, rich orchestral strings, clear and prominent dynamics";
    } else {
        // 예외 처리 (기본값)
        tagInstruments = "featuring soft acoustic guitar, gentle strings, organic and raw production";
    }

    // 5. 프롬프트 조립 (Base -> Instrument -> Emotion -> BPM)
    let finalPrompt = `${baseTheme}, ${tagInstruments}, ${tagEmotion}, ${tagBPMTexture}`;

    // 6. (옵션) 환경음 녹음 파일이 제공되었을 경우 추가 태그
    if (hasAudio) {
        finalPrompt += ", layered with organic natural ambient sounds, blending seamlessly with the environment";
    }

    return finalPrompt;
}

export default generateMusicGenPrompt;