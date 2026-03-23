export const getCropGuide = (cropName) => {
    const crop = cropName.toLowerCase();
    
    // Specific, highly detailed guides for major crops
    const specificData = {
      rice: {
        steps: [
          { title: "Land Preparation", description: "Plow the field 3-4 times and puddle the soil to retain water. Ensure the field is well-leveled.", image: "https://loremflickr.com/400/250/agriculture,tractor" },
          { title: "Nursery & Sowing", description: "Raise seedlings for 20-30 days before transplanting them into the flooded field. Maintain proper spacing.", image: "https://loremflickr.com/400/250/rice,seedling" },
          { title: "Water Management", description: "Maintain 2-5 cm of standing water throughout the vegetative stage. Drain water 10 days before harvesting.", image: "https://loremflickr.com/400/250/paddy,water" },
          { title: "Harvesting", description: "Harvest when 80% of the panicles turn golden brown and moisture drops to 20%.", image: "https://loremflickr.com/400/250/rice,harvest" }
        ],
        fertilizers: "Apply NPK at 120:60:60 kg/ha. Apply Nitrogen in 3 splits (basal, tillering, and panicle initiation) for maximum efficiency.",
        diseases: [
          { name: "Rice Blast", symptoms: "Spindle-shaped spots on leaves with grey centers and dark margins.", treatment: "Spray Tricyclazole (0.6g/L) or Propiconazole (1ml/L).", image: "https://loremflickr.com/300/200/plant,disease" },
          { name: "Brown Spot", symptoms: "Oval, dark brown spots on leaves and grains causing quality loss.", treatment: "Use Mancozeb or validamycin. Improve soil fertility.", image: "https://loremflickr.com/300/200/leaf,fungus" }
        ]
      },
      maize: {
        steps: [
          { title: "Soil Preparation", description: "Plough deep to break hardpan. Maize requires well-drained loamy soil with sufficient organic matter.", image: "https://loremflickr.com/400/250/farming,plough" },
          { title: "Seed Sowing", description: "Plant seeds 3-5 cm deep with a spacing of 60x20 cm. Use 20 kg seeds per hectare.", image: "https://loremflickr.com/400/250/corn,seeds" },
          { title: "Weed Control", description: "Keep the field weed-free for the first 30-40 days. Use pre-emergence herbicides like Atrazine.", image: "https://loremflickr.com/400/250/maize,weeding" },
          { title: "Harvest", description: "Harvest when husks turn yellow and grains are hard and dry (around 20% moisture).", image: "https://loremflickr.com/400/250/corn,harvest" }
        ],
        fertilizers: "General recommendation: 120:60:40 kg NPK/ha. Apply half Nitrogen and full PK as basal dose.",
        diseases: [
          { name: "Turcicum Leaf Blight", symptoms: "Long, elliptical, greyish-green or brown lesions on leaves.", treatment: "Spray Mancozeb at 2.5 g/L of water at 10-day intervals.", image: "https://loremflickr.com/300/200/corn,disease" },
          { name: "Stem Borer", symptoms: "Dead heart formation and pinholes on leaves.", treatment: "Apply Carbofuran 3G inside the leaf whorls.", image: "https://loremflickr.com/300/200/pest,insect" }
        ]
      },
      cotton: {
        steps: [
          { title: "Field Prep", description: "Deep ploughing is essential. Cotton has a deep root system. Create ridges and furrows.", image: "https://loremflickr.com/400/250/cotton,field" },
          { title: "Sowing", description: "Sow seeds at a spacing of 90x60 cm. Treat seeds with fungicides before planting.", image: "https://loremflickr.com/400/250/sowing,seeds" },
          { title: "Irrigation", description: "Irrigate every 15-20 days. Avoid waterlogging at all costs.", image: "https://loremflickr.com/400/250/irrigation,farm" },
          { title: "Picking", description: "Hand-pick mature, fully opened bolls in the morning when moisture is lowest.", image: "https://loremflickr.com/400/250/cotton,harvest" }
        ],
        fertilizers: "Apply 120:60:60 kg/ha of NPK. Foliar spray of 2% DAP at boll formation stage is very effective.",
        diseases: [
          { name: "Bollworm", symptoms: "Holes in bolls, shedding of squares and young bolls.", treatment: "Use Bt Cotton seeds and spray Emamectin benzoate or Spinosad if infestation crosses ETL.", image: "https://loremflickr.com/300/200/bollworm,pest" }
        ]
      }
    };
  
    if (specificData[crop]) return specificData[crop];
  
    // Smart dynamic generic template for all other 20+ crops!
    return {
      steps: [
        { 
          title: "Land Preparation", 
          description: `Clear the field of previous crop residue and weeds. Plough the soil 2-3 times to create a fine, well-aerated tilth suitable for ${crop} cultivation. Ensure proper drainage to avoid water stagnation.`, 
          image: `https://loremflickr.com/400/250/${crop},field` 
        },
        { 
          title: "Seed Selection & Sowing", 
          description: `Procure high-yielding, certified seeds of ${crop}. Treat seeds with organic fungicides (like Trichoderma) to prevent soil-borne diseases. Sow at the recommended depth and spacing.`, 
          image: `https://loremflickr.com/400/250/${crop},seeds` 
        },
        { 
          title: "Irrigation & Weed Management", 
          description: `Provide timely irrigation, especially during critical growth periods like flowering and grain/fruit filling stages of the ${crop}. Keep the field completely weed-free for the first 45 days.`, 
          image: `https://loremflickr.com/400/250/irrigation,${crop}` 
        },
        { 
          title: "Harvesting & Storage", 
          description: `Harvest the ${crop} at optimal physiological maturity to ensure maximum yield and nutritional quality. Dry the produce properly before storing in a dry, well-ventilated location to prevent fungal growth.`, 
          image: `https://loremflickr.com/400/250/${crop},harvest` 
        }
      ],
      fertilizers: `Conduct a basic soil test before planting ${crop}. Apply a well-balanced blend of Nitrogen, Phosphorus, and Potassium (NPK) according to regional soil requirements. Supplement with 10-15 tonnes of farmyard manure (FYM) per hectare during land preparation for sustained soil health.`,
      diseases: [
        { 
          name: "Common Fungal Blight", 
          symptoms: `Appearance of yellow, brown, or black irregular spots and discoloration on the foliage of the ${crop} plant. Often accompanied by wilting or premature leaf drop.`, 
          treatment: "Maintain proper plant spacing for air circulation. Spray broad-spectrum organic neem oil extract or a protective fungicide like Mancozeb immediately upon noticing symptoms.", 
          image: `https://loremflickr.com/300/200/plant,disease` 
        },
        { 
          name: "Sucking Pests (Aphids/Whiteflies)", 
          symptoms: `Insects clustering on the underside of leaves and tender stems, causing yellowing, curling, and stunted growth of the ${crop}. Sticky honeydew may be visible.`, 
          treatment: "Install yellow sticky traps in the field. Spray 5% Neem Seed Kernel Extract (NSKE) or an appropriate systemic insecticide if population exceeds the economic threshold level.", 
          image: `https://loremflickr.com/300/200/pest,insect` 
        }
      ]
    }
  }
