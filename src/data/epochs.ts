
export const DECADES = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s'];

export const AESTHETICS = [
  {
    id: 'noir',
    label: 'Studio Noir',
    description: 'Cinematic B&W',
    prompt: 'STYLE DIRECTIVE: High-contrast black and white photography. Dramatic chiaroscuro lighting. 35mm film grain. Film Noir atmosphere. Sharp focus on eyes. Timeless and elegant.'
  },
  {
    id: 'chroma',
    label: 'Chroma Neon',
    description: 'Cyberpunk Gloss',
    prompt: 'STYLE DIRECTIVE: Cyberpunk color grading. Heavy neon rim lighting (Cyan/Magenta). Wet surfaces with reflections. High saturation. Futuristic fashion editorial look. Anamorphic lens flares.'
  },
  {
    id: 'vintage',
    label: 'Analog',
    description: 'Faded Film',
    prompt: 'STYLE DIRECTIVE: Authentic vintage Kodachrome film stock. Warm yellow/orange color cast. Soft vignette. Dust and scratches. Nostalgic family album aesthetic. Slightly soft focus. Bleached highlights.'
  },
  {
    id: 'ethereal',
    label: 'Ethereal',
    description: 'Dreamcore',
    prompt: 'STYLE DIRECTIVE: Dreamcore aesthetic. Soft bloom lighting. Pastel color palette. Angelic glow. Volumetric fog. Surreal atmosphere. Heavenly composition. Soft, painterly texture.'
  }
];

const INTELLIGENT_NEGATIVE_PROMPT = `
NEGATIVE PROMPT / AVOID:
blurry, low quality, distortion, bad anatomy, extra fingers, missing limbs, deformed hands, ugly face, crossed eyes, watermark, text, signature, logo, border, frame, cartoonish, lowres, jpeg artifacts, overexposed, underexposed, glitch, plastic skin, doll-like.
`;

const SCENE_DESCRIPTIONS: Record<string, string> = {
    '1950s': `Scene: A classic 1950s diner or jazz club.
Action: The user is the main star, interacting naturally with the environment.
Vibe: Golden Age of Hollywood.`,

    '1960s': `Scene: A sunny day in Hyde Park, London, or a rock concert.
Action: The user is part of the counter-culture revolution.
Vibe: British Invasion, Flower Power.`,

    '1970s': `Scene: Center of the dance floor at a disco or a gritty NYC street.
Action: The user is striking a pose, exuding confidence.
Vibe: Disco fever, raw energy.`,

    '1980s': `Scene: A neon-lit arcade or a mall atrium.
Action: The user is hanging out, looking cool in 80s fashion.
Vibe: Synthwave, retro-futurism.`,

    '1990s': `Scene: A gritty urban street corner or a music video set.
Action: The user is wearing oversized streetwear, looking authentic.
Vibe: Grunge, Hip Hop, raw texture.`,

    '2000s': `Scene: A pop music video set or red carpet.
Action: The user is a celebrity, waving to fans.
Vibe: Y2K glossy, digital pop.`,

    '2010s': `Scene: A music festival main stage or influencer spot.
Action: The user is taking a selfie or enjoying the moment.
Vibe: Instagram filter, lens flare, modern digital.`,
};

export function constructPrompt(decade: string, aestheticId: string): string {
    const aesthetic = AESTHETICS.find(a => a.id === aestheticId) || AESTHETICS[0];
    const scene = SCENE_DESCRIPTIONS[decade] || `Scene: A stylized representation of the ${decade}.`;

    return `
SINGULARITY PROTOCOL: REMIX ENGAGED.
TARGET ERA: ${decade}
TARGET AESTHETIC: ${aesthetic.label}

${aesthetic.prompt}

SCENE MATRIX:
${scene}

SUBJECT RULES (STRICT):
1. MAIN CHARACTER (User): Extreme face lock. Retain facial structure, identity, and ethnicity. Adapt hair and styling to the ${decade} perfectly.
2. COMPOSITION: Cinematic depth of field. Rule of thirds.
3. QUALITY: Masterpiece, 8k resolution, highly detailed.

${INTELLIGENT_NEGATIVE_PROMPT}
`;
}
