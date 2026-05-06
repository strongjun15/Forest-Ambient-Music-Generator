/**
 * Canny Edge 데이터로부터 엣지 밀도(%)를 계산
 * @param {Uint8Array} edgePixelData - 1D 그레이스케일 엣지 배열
 * @returns {number} 엣지 밀도 백분율 (0 ~ 100)
 */
export function calculateEdgeDensity(edgePixelData) {
    let edgePixelCount = 0;
    const totalPixels = edgePixelData.length;

    for (let i = 0; i < totalPixels; i++) {
        if (edgePixelData[i] > 128) {
            edgePixelCount++;
        }
    }

    const density = (edgePixelCount / totalPixels) * 100;
    return Number(density.toFixed(2));
}

/**
 * HSV + EdgeDensity 기반 MusicGen 프롬프트 생성
 * @param {number} h - Hue (0 ~ 360)
 * @param {number} s - Saturation (0 ~ 100)
 * @param {number} v - Value (0 ~ 100)
 * @param {number} edgeDensity - Edge Density (0 ~ 100)
 * @param {boolean} hasAudio - 주변 소리 유무
 * @returns {string} MusicGen 텍스트 프롬프트
 */
export default function generateMultimodalPrompt(h, s, v, edgeDensity, hasAudio = false) {
    const baseTheme = "Ambient nature music set in a Jeju Gotjawal forest";

    let tagMood = "";
    let tagTimbre = "";
    let tagDynamics = "";
    let tagComplexity = "";

    // A. Hue -> Mood & Emotion
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

    // B. Saturation -> Timbre
    if (s >= 0 && s < 30) {
        tagTimbre = "muffled tape saturation, lo-fi organic texture, washed out";
    } else if (s >= 30 && s < 70) {
        tagTimbre = "natural acoustic resonance, organic production";
    } else {
        tagTimbre = "crystal clear synth tones, lush and pristine high-fidelity";
    }

    // C. Value -> Space & Dynamics
    if (v >= 0 && v < 30) {
        tagDynamics = "extremely soft whispery volume, distant reverberation, dark enclosed space";
    } else if (v >= 30 && v < 70) {
        tagDynamics = "intimate forest atmosphere, balanced dynamics";
    } else {
        tagDynamics = "bright and prominent dynamics, vast open space, airy reverb";
    }

    // D. Edge Density -> Complexity, Instruments & Tempo
    if (edgeDensity >= 0 && edgeDensity < 5) {
        tagComplexity = "minimalist, featuring sparse piano and long sustained drone pads, very slow tempo around 50 BPM, clean and empty musical space";
    } else if (edgeDensity >= 5 && edgeDensity < 15) {
        tagComplexity = "gentle rhythmic movement, featuring soft acoustic guitar and flowing strings, slow tempo around 65 BPM, layered organic textures";
    } else {
        tagComplexity = "complex intricate textures, featuring fluttering flutes and granular synths, polyrhythmic organic percussion, moderate tempo around 80 BPM, busy and dense arrangement";
    }

    // E. 프롬프트 조립
    let finalPrompt = `${baseTheme}, ${tagComplexity}, ${tagTimbre}, ${tagDynamics}, ${tagMood}`;

    if (hasAudio) {
        finalPrompt += ", organically layered with raw environmental field recordings, natural foley blend";
    }

    return finalPrompt;
}
