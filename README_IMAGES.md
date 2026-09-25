# 🖼️ Azamora Image & Media Guide (High Resolution)

This guide defines the recommended sizes, aspect ratios, and formats for the images used in the Azamora project. Dimensions are optimized for **High-DPI / Retina** displays to ensure maximum clarity and a premium look.

---

## 🔝 1. Hero Section (Home & Main Pages)
The Hero is the most critical visual element. It uses a parallax effect and covers the full screen.

| Property | Recommendation (2x) |
| :--- | :--- |
| **Dimensions** | 3840 x 2160 px |
| **Aspect Ratio** | 16:9 |
| **Format** | Optimized `.jpg` or `.webp` |
| **Notes** | If using **Video**, use 1920x1080px `.mp4` (H.264) with a file size under **15MB** to maintain performance. |

---

## 🎁 2. Promotional Banner (Ads)
Used in the split-view section of the Home page.

| Property | Recommendation (2x) |
| :--- | :--- |
| **Dimensions** | 2000 x 2400 px |
| **Aspect Ratio** | 5:6 (Vertical/Portrait) |
| **Format** | `.jpg` or `.webp` |
| **Content** | High-quality lifestyle images of clean environments or professional equipment. |

---

## 🧹 3. Service Cards
Displayed in the horizontal scroll section.

| Property | Recommendation (2x) |
| :--- | :--- |
| **Dimensions** | 2400 x 1600 px |
| **Aspect Ratio** | 3:2 or 1:1 |
| **Format** | `.jpg` or `.webp` |
| **Style** | Clear subject (e.g., a specific cleaning task) with good lighting. |

---

## 🍱 4. Bento Grid (Why Us / Benefits)
Used in the "Certified Excellence" section.

| Property | Recommendation (2x) |
| :--- | :--- |
| **Dimensions** | 1600 x 2400 px |
| **Aspect Ratio** | 2:3 (Portrait) |
| **Format** | `.jpg` or `.webp` |
| **Notes** | Images here are often partially overlayed by gradients, so keep the main subject centered. |

---

## 🏅 5. Certification Logos
Found in the scrolling marquee.

| Property | Recommendation (2x) |
| :--- | :--- |
| **Dimensions** | 600 x 400 px (Canvas) |
| **Aspect Ratio** | Variable, centered in the canvas |
| **Format** | **`.png` with transparency** |
| **Important** | Use high-resolution logos. The UI will automatically apply a grayscale effect, but the source should be clean. |

---

## 📞 6. Contact Page Hero
The section where the contact form is located.

| Property | Recommendation (2x) |
| :--- | :--- |
| **Dimensions** | 3840 x 2400 px |
| **Aspect Ratio** | 16:10 or 16:9 |
| **Format** | `.jpg` |
| **Style** | Atmospheric/Minimalist. Avoid high-contrast details where text needs to be readable. |

---

## 📢 7. Call To Action (CTA) Banner
The final banner before the footer.

| Property | Recommendation (2x) |
| :--- | :--- |
| **Dimensions** | 3840 x 1600 px |
| **Aspect Ratio** | Cinematic wide (approx 21:9) |
| **Format** | `.jpg` |
| **Note** | Used as a fixed background. Texture or minimalist clean spaces work best. |

---

## 💡 Technical Optimization Tips (Retina Strategy)

1.  **Compression**: Since these are high-resolution images, compression is **VITAL**. Always run images through [Squoosh](https://squoosh.app/) to find the best quality/size balance.
2.  **WebP/AVIF**: Prioritize `.webp` for all photography to keep 2x resolution files light.
3.  **Filenames**: Use descriptive names like `hero-cleaning-service@2x.jpg` to identify high-res assets.
4.  **Color Space**: Use **Display P3** or **sRGB** profiles to take advantage of wide-color displays.
