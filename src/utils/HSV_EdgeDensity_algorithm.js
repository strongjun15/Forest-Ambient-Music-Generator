/**
 * 1. Canny Edge 데이터로부터 엣지 밀도(%)를 계산하는 함수
 * (주의: OpenCV.js 등을 통해 이미지에서 윤곽선만 하얗게(255) 추출된 배열이 필요합니다)
 * @param {Uint8Array} edgePixelData - 캔버스나 OpenCV에서 추출한 1D 픽셀 데이터 배열
 * @returns {number} 엣지 밀도 백분율 (0 ~ 100)
 */
function calculateEdgeDensity(edgePixelData) {
    let edgePixelCount = 0;
    const totalPixels = edgePixelData.length;

    // 하얀색(255)에 가까운 픽셀(윤곽선)의 개수를 센다
    for (let i = 0; i < totalPixels; i++) {
        if (edgePixelData[i] > 128) { // 임계값(Threshold) 이상이면 엣지로 간주
            edgePixelCount++;
        }
    }

    const density = (edgePixelCount / totalPixels) * 100;
    return Number(density.toFixed(2));
}


/**
 * 2. 분리된 파라미터를 기반으로 MusicGen 프롬프트를 생성하는 메인 함수
 * @param {number} h - Hue (0 ~ 360) : 무드 및 감성
 * @param {number} s - Saturation (0 ~ 100) : 음색 질감 (Lo-Fi vs Hi-Fi)
 * @param {number} v - Value (0 ~ 100) : 공간감 및 다이내믹스
 * @param {number} edgeDensity - Edge Density (0 ~ 100) : 복잡도, 악기, 템포
 * @param {boolean} hasAudio - 주변 소리 유무
 * @returns {string} 완성된 MusicGen 텍스트 프롬프트
 */
function generateMultimodalPrompt(h, s, v, edgeDensity, hasAudio = false) {
    const baseTheme = "Ambient nature music set in a Jeju Gotjawal forest";

    let tagMood = "";
    let tagTimbre = "";
    let tagDynamics = "";
    let tagComplexity = "";

    // --------------------------------------------------
    // A. Hue (색상) -> Mood & Emotion (감정과 분위기)
    // --------------------------------------------------
    if ((h >= 0 && h < 30) || (h >= 330 && h <= 360)) {
        tagMood = "subtle mystical energy, warm resonance";
    } else if (h >= 30 && h < 90) {
        tagMood = "sunlit, hopeful and gentle atmosphere";
    } else if (h >= 90 && h < 150) {
        tagMood = "peaceful, healing, serene and lush mood";
    } else if (h >= 150 && h < 210) {
        tagMood = "airy, refreshing and calm vibe";
    } else if (h >= 210 && h < 270) {
        tagMood = "mysterious, melancholic, deep solemn mood";
    } else {
        tagMood = "dreamy, ethereal, surreal landscape";
    }

    // --------------------------------------------------
    // B. Saturation (채도) -> Timbre (음색의 질감: 선명도/탁함)
    // --------------------------------------------------
    if (s >= 0 && s < 30) {
        tagTimbre = "muffled tape saturation, lo-fi organic texture, washed out";
    } else if (s >= 30 && s < 70) {
        tagTimbre = "natural acoustic resonance, organic production";
    } else {
        tagTimbre = "crystal clear synth tones, lush and pristine high-fidelity";
    }

    // --------------------------------------------------
    // C. Value (명도) -> Space & Dynamics (공간감과 음량)
    // --------------------------------------------------
    if (v >= 0 && v < 30) {
        tagDynamics = "extremely soft whispery volume, distant reverberation, dark enclosed space";
    } else if (v >= 30 && v < 70) {
        tagDynamics = "intimate forest atmosphere, balanced dynamics";
    } else {
        tagDynamics = "bright and prominent dynamics, vast open space, airy reverb";
    }

    // --------------------------------------------------
    // D. Edge Density (엣지 밀도) -> Complexity, Instruments & Tempo
    // (이 부분이 곡의 '뼈대'를 결정합니다)
    // --------------------------------------------------
    if (edgeDensity >= 0 && edgeDensity < 5) {
        // 복잡도 낮음: 하늘, 큰 바위, 여백
        tagComplexity = "minimalist, featuring sparse piano and long sustained drone pads, very slow tempo around 50 BPM, clean and empty musical space";
    } else if (edgeDensity >= 5 && edgeDensity < 15) {
        // 복잡도 중간: 일반적인 숲길, 적당한 식생
        tagComplexity = "gentle rhythmic movement, featuring soft acoustic guitar and flowing strings, slow tempo around 65 BPM, layered organic textures";
    } else {
        // 복잡도 높음 (15 이상): 빽빽한 덩굴, 나뭇가지
        tagComplexity = "complex intricate textures, featuring fluttering flutes and granular synths, polyrhythmic organic percussion, moderate tempo around 80 BPM, busy and dense arrangement";
    }

    // --------------------------------------------------
    // E. 프롬프트 조립 (MusicGen이 선호하는 순서로 배치)
    // [기본배경], [엣지:악기/템포], [채도:음색질감], [명도:공간감], [색상:무드]
    // --------------------------------------------------
    let finalPrompt = `${baseTheme}, ${tagComplexity}, ${tagTimbre}, ${tagDynamics}, ${tagMood}`;

    if (hasAudio) {
        finalPrompt += ", organically layered with raw environmental field recordings, natural foley blend";
    }

    return finalPrompt;
}

// ==========================================
// 시뮬레이션 테스트
// ==========================================

// Case 1: 짙은 안개 속 거대한 현무암 (저채도, 저명도, 낮은 엣지 밀도)
const p1 = generateMultimodalPrompt(220, 20, 25, 2.5, false);
console.log("▶ Case 1 (안개/현무암):\n", p1, "\n");

// Case 2: 햇빛이 비치는 빽빽한 덩굴 식물 (고채도, 고명도, 높은 엣지 밀도)
const p2 = generateMultimodalPrompt(110, 85, 90, 22.0, true);
console.log("▶ Case 2 (덩굴/새소리):\n", p2);