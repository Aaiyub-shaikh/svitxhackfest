# Disease Information Database
# Contains descriptions, recommendations, and pesticide suggestions for plant diseases

DISEASE_INFO = {
    'Apple___Apple_scab': {
        'description': 'Apple scab is a fungal disease that causes dark, scaly lesions on leaves, fruit, and twigs.',
        'symptoms': 'Dark olive-green to black spots on leaves, premature leaf drop, scaly lesions on fruit',
        'recommendations': [
            'Remove fallen leaves and debris',
            'Improve air circulation by pruning',
            'Plant resistant varieties',
            'Apply fungicides during wet spring weather'
        ],
        'pesticides': [
            'Mancozeb (Fungicide)',
            'Myclobutanil (Systemic fungicide)',
            'Captan (Protective fungicide)',
            'Copper-based fungicides'
        ],
        'organic_treatment': 'Neem oil, Baking soda spray, Compost tea'
    },
    
    'Apple___Black_rot': {
        'description': 'Black rot is a fungal disease causing leaf spots and fruit rot in apple trees.',
        'symptoms': 'Brown leaf spots with purple margins, black cankers on branches, mummified fruit',
        'recommendations': [
            'Remove infected fruit and debris',
            'Prune infected branches',
            'Improve orchard sanitation',
            'Apply preventive fungicides'
        ],
        'pesticides': [
            'Thiophanate-methyl',
            'Propiconazole',
            'Mancozeb',
            'Copper sulfate'
        ],
        'organic_treatment': 'Copper soap, Bacillus subtilis, Proper sanitation'
    },
    
    'Apple___Cedar_apple_rust': {
        'description': 'Cedar apple rust is a fungal disease requiring both apple and cedar trees to complete its life cycle.',
        'symptoms': 'Bright orange spots on apple leaves, distorted fruit, premature leaf drop',
        'recommendations': [
            'Remove nearby cedar trees if possible',
            'Plant resistant apple varieties',
            'Apply fungicides in early spring',
            'Remove infected leaves'
        ],
        'pesticides': [
            'Myclobutanil',
            'Propiconazole',
            'Mancozeb',
            'Tebuconazole'
        ],
        'organic_treatment': 'Sulfur-based fungicides, Neem oil, Resistant varieties'
    },
    
    'Apple___healthy': {
        'description': 'Healthy apple plant with no visible disease symptoms.',
        'symptoms': 'Green healthy leaves, normal growth, no spots or lesions',
        'recommendations': [
            'Continue regular care and monitoring',
            'Maintain proper watering schedule',
            'Apply balanced fertilizer',
            'Regular pruning for air circulation'
        ],
        'pesticides': ['No treatment needed'],
        'organic_treatment': 'Continue organic care practices'
    },
    
    'Blueberry___healthy': {
        'description': 'Healthy blueberry plant showing normal growth and development.',
        'symptoms': 'Healthy green foliage, normal berry development, no disease signs',
        'recommendations': [
            'Maintain acidic soil (pH 4.5-5.5)',
            'Regular watering with good drainage',
            'Apply acidic fertilizer',
            'Mulch around plants'
        ],
        'pesticides': ['No treatment needed'],
        'organic_treatment': 'Organic mulch, compost, proper care'
    },
    
    'Cherry_(including_sour)___Powdery_mildew': {
        'description': 'Powdery mildew appears as white, powdery fungal growth on cherry leaves and fruit.',
        'symptoms': 'White powdery coating on leaves, stunted growth, leaf curling',
        'recommendations': [
            'Improve air circulation',
            'Avoid overhead watering',
            'Remove infected plant parts',
            'Apply fungicides preventively'
        ],
        'pesticides': [
            'Sulfur-based fungicides',
            'Potassium bicarbonate',
            'Myclobutanil',
            'Trifloxystrobin'
        ],
        'organic_treatment': 'Baking soda spray, Neem oil, Milk spray'
    },
    
    'Cherry_(including_sour)___healthy': {
        'description': 'Healthy cherry tree with normal foliage and fruit development.',
        'symptoms': 'Healthy green leaves, normal fruit set, vigorous growth',
        'recommendations': [
            'Regular pruning after harvest',
            'Maintain consistent watering',
            'Apply balanced fertilizer',
            'Monitor for pests and diseases'
        ],
        'pesticides': ['No treatment needed'],
        'organic_treatment': 'Preventive organic care, compost application'
    },
    
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
        'description': 'Gray leaf spot is a fungal disease causing rectangular lesions on corn leaves.',
        'symptoms': 'Rectangular gray to tan lesions on leaves, premature leaf death',
        'recommendations': [
            'Plant resistant varieties',
            'Rotate crops',
            'Remove crop debris',
            'Apply fungicides if severe'
        ],
        'pesticides': [
            'Azoxystrobin',
            'Propiconazole',
            'Pyraclostrobin',
            'Tebuconazole'
        ],
        'organic_treatment': 'Crop rotation, resistant varieties, proper sanitation'
    },
    
    'Corn_(maize)___Common_rust_': {
        'description': 'Common rust causes small, reddish-brown pustules on corn leaves.',
        'symptoms': 'Small reddish-brown pustules on leaves, yellowing of leaves',
        'recommendations': [
            'Plant resistant hybrids',
            'Monitor weather conditions',
            'Apply fungicides if needed',
            'Maintain good field hygiene'
        ],
        'pesticides': [
            'Azoxystrobin',
            'Propiconazole',
            'Tebuconazole',
            'Pyraclostrobin'
        ],
        'organic_treatment': 'Resistant varieties, proper spacing, organic fungicides'
    },
    
    'Corn_(maize)___Northern_Leaf_Blight': {
        'description': 'Northern leaf blight causes large, elliptical lesions on corn leaves.',
        'symptoms': 'Large tan lesions with dark borders, significant leaf damage',
        'recommendations': [
            'Use resistant hybrids',
            'Rotate with non-host crops',
            'Bury crop residue',
            'Apply fungicides when needed'
        ],
        'pesticides': [
            'Azoxystrobin',
            'Propiconazole',
            'Pyraclostrobin',
            'Fluxapyroxad'
        ],
        'organic_treatment': 'Crop rotation, resistant varieties, field sanitation'
    },
    
    'Corn_(maize)___healthy': {
        'description': 'Healthy corn plant with normal growth and development.',
        'symptoms': 'Green healthy leaves, normal ear development, vigorous growth',
        'recommendations': [
            'Maintain adequate soil moisture',
            'Apply nitrogen fertilizer',
            'Control weeds',
            'Monitor for pests'
        ],
        'pesticides': ['No treatment needed'],
        'organic_treatment': 'Organic fertilizers, companion planting, natural pest control'
    },
    
    'Grape___Black_rot': {
        'description': 'Black rot is a serious fungal disease affecting grape clusters and leaves.',
        'symptoms': 'Brown leaf spots, mummified grapes, cankers on canes',
        'recommendations': [
            'Remove mummified berries',
            'Prune for air circulation',
            'Apply preventive fungicides',
            'Maintain vineyard sanitation'
        ],
        'pesticides': [
            'Mancozeb',
            'Captan',
            'Myclobutanil',
            'Copper-based fungicides'
        ],
        'organic_treatment': 'Copper soap, sulfur, proper sanitation'
    },
    
    'Grape___Esca_(Black_Measles)': {
        'description': 'Esca is a complex fungal disease causing leaf spots and vine decline.',
        'symptoms': 'Tiger stripe patterns on leaves, berry spotting, vine decline',
        'recommendations': [
            'Prune out infected wood',
            'Protect pruning wounds',
            'Improve vine nutrition',
            'Reduce plant stress'
        ],
        'pesticides': [
            'Copper-based fungicides',
            'Thiophanate-methyl',
            'Protective wound dressings'
        ],
        'organic_treatment': 'Proper pruning practices, nutrition management, stress reduction'
    },
    
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
        'description': 'Leaf blight causes brown spots and premature defoliation in grapes.',
        'symptoms': 'Brown spots on leaves, premature leaf drop, reduced vigor',
        'recommendations': [
            'Improve air circulation',
            'Remove infected leaves',
            'Apply fungicides preventively',
            'Manage canopy density'
        ],
        'pesticides': [
            'Mancozeb',
            'Copper fungicides',
            'Azoxystrobin',
            'Captan'
        ],
        'organic_treatment': 'Copper soap, neem oil, proper pruning'
    },
    
    'Grape___healthy': {
        'description': 'Healthy grape vine with normal foliage and fruit development.',
        'symptoms': 'Healthy green leaves, normal cluster development, vigorous growth',
        'recommendations': [
            'Regular pruning and training',
            'Maintain consistent watering',
            'Apply balanced fertilizer',
            'Monitor for diseases and pests'
        ],
        'pesticides': ['No treatment needed'],
        'organic_treatment': 'Organic fertilizers, compost, preventive care'
    },
    
    'Orange___Haunglongbing_(Citrus_greening)': {
        'description': 'Huanglongbing is a devastating bacterial disease spread by psyllids.',
        'symptoms': 'Yellow mottled leaves, misshapen bitter fruit, tree decline',
        'recommendations': [
            'Remove infected trees immediately',
            'Control psyllid vectors',
            'Plant certified disease-free trees',
            'Monitor regularly'
        ],
        'pesticides': [
            'Imidacloprid (for psyllids)',
            'Thiamethoxam',
            'Abamectin',
            'Antibiotics (where legal)'
        ],
        'organic_treatment': 'Vector control, tree removal, resistant varieties'
    },
    
    'Peach___Bacterial_spot': {
        'description': 'Bacterial spot causes lesions on peach fruit and leaves.',
        'symptoms': 'Small dark spots on fruit, angular leaf spots, fruit cracking',
        'recommendations': [
            'Plant resistant varieties',
            'Apply copper sprays',
            'Prune for air circulation',
            'Avoid overhead irrigation'
        ],
        'pesticides': [
            'Copper-based bactericides',
            'Streptomycin',
            'Kasugamycin',
            'Oxytetracycline'
        ],
        'organic_treatment': 'Copper soap, resistant varieties, cultural practices'
    },
    
    'Peach___healthy': {
        'description': 'Healthy peach tree with normal fruit and foliage development.',
        'symptoms': 'Healthy green leaves, normal fruit development, vigorous growth',
        'recommendations': [
            'Regular pruning for shape and health',
            'Thin fruit for better quality',
            'Apply balanced fertilizer',
            'Monitor for pests and diseases'
        ],
        'pesticides': ['No treatment needed'],
        'organic_treatment': 'Organic fertilizers, proper pruning, preventive care'
    },
    
    'Pepper,_bell___Bacterial_spot': {
        'description': 'Bacterial spot causes dark lesions on pepper leaves and fruit.',
        'symptoms': 'Small dark spots on leaves and fruit, yellowing, defoliation',
        'recommendations': [
            'Use certified disease-free seeds',
            'Rotate crops',
            'Apply copper bactericides',
            'Avoid overhead watering'
        ],
        'pesticides': [
            'Copper hydroxide',
            'Copper sulfate',
            'Streptomycin',
            'Kasugamycin'
        ],
        'organic_treatment': 'Copper soap, crop rotation, resistant varieties'
    },
    
    'Pepper,_bell___healthy': {
        'description': 'Healthy bell pepper plant with normal growth and fruit development.',
        'symptoms': 'Green healthy foliage, normal pepper development, vigorous growth',
        'recommendations': [
            'Maintain consistent watering',
            'Provide adequate support',
            'Apply balanced fertilizer',
            'Monitor for pests'
        ],
        'pesticides': ['No treatment needed'],
        'organic_treatment': 'Organic fertilizers, companion planting, natural pest control'
    },
    
    'Potato___Early_blight': {
        'description': 'Early blight causes dark spots with concentric rings on potato leaves.',
        'symptoms': 'Dark spots with target-like rings on leaves, premature defoliation',
        'recommendations': [
            'Rotate crops',
            'Remove infected plant debris',
            'Apply fungicides preventively',
            'Maintain good air circulation'
        ],
        'pesticides': [
            'Chlorothalonil',
            'Mancozeb',
            'Azoxystrobin',
            'Copper fungicides'
        ],
        'organic_treatment': 'Baking soda spray, neem oil, crop rotation'
    },
    
    'Potato___Late_blight': {
        'description': 'Late blight is a serious fungal disease that can destroy potato crops rapidly.',
        'symptoms': 'Water-soaked lesions on leaves, white growth on leaf undersides, tuber rot',
        'recommendations': [
            'Use certified seed potatoes',
            'Apply preventive fungicides',
            'Ensure good drainage',
            'Remove infected plants immediately'
        ],
        'pesticides': [
            'Mancozeb',
            'Chlorothalonil',
            'Metalaxyl',
            'Copper fungicides'
        ],
        'organic_treatment': 'Copper fungicides, resistant varieties, proper sanitation'
    },
    
    'Potato___healthy': {
        'description': 'Healthy potato plant with normal foliage and tuber development.',
        'symptoms': 'Green healthy foliage, normal growth, no disease symptoms',
        'recommendations': [
            'Maintain consistent watering',
            'Hill soil around plants',
            'Apply balanced fertilizer',
            'Monitor for pests and diseases'
        ],
        'pesticides': ['No treatment needed'],
        'organic_treatment': 'Organic fertilizers, proper cultivation, preventive care'
    },
    
    'Raspberry___healthy': {
        'description': 'Healthy raspberry plant with normal cane and fruit development.',
        'symptoms': 'Healthy green canes and leaves, normal berry production',
        'recommendations': [
            'Prune old canes after harvest',
            'Maintain good air circulation',
            'Apply organic matter',
            'Regular watering during fruit development'
        ],
        'pesticides': ['No treatment needed'],
        'organic_treatment': 'Compost, organic mulch, proper pruning'
    },
    
    'Soybean___healthy': {
        'description': 'Healthy soybean plant with normal growth and pod development.',
        'symptoms': 'Healthy green foliage, normal pod fill, vigorous growth',
        'recommendations': [
            'Maintain adequate soil moisture',
            'Monitor for pests',
            'Apply appropriate fertilizer',
            'Ensure good weed control'
        ],
        'pesticides': ['No treatment needed'],
        'organic_treatment': 'Organic fertilizers, companion planting, natural pest control'
    },
    
    'Squash___Powdery_mildew': {
        'description': 'Powdery mildew appears as white powdery growth on squash leaves.',
        'symptoms': 'White powdery coating on leaves, yellowing, reduced fruit quality',
        'recommendations': [
            'Improve air circulation',
            'Avoid overhead watering',
            'Remove infected leaves',
            'Apply fungicides preventively'
        ],
        'pesticides': [
            'Sulfur-based fungicides',
            'Potassium bicarbonate',
            'Myclobutanil',
            'Azoxystrobin'
        ],
        'organic_treatment': 'Baking soda spray, neem oil, milk spray'
    },
    
    'Strawberry___Leaf_scorch': {
        'description': 'Leaf scorch causes purple to brown spots on strawberry leaves.',
        'symptoms': 'Purple to brown spots on leaves, premature leaf drop, reduced vigor',
        'recommendations': [
            'Remove infected leaves',
            'Improve air circulation',
            'Avoid overhead watering',
            'Apply fungicides if severe'
        ],
        'pesticides': [
            'Captan',
            'Myclobutanil',
            'Azoxystrobin',
            'Copper fungicides'
        ],
        'organic_treatment': 'Copper soap, proper sanitation, resistant varieties'
    },
    
    'Strawberry___healthy': {
        'description': 'Healthy strawberry plant with normal runner and fruit production.',
        'symptoms': 'Healthy green leaves, normal berry development, active growth',
        'recommendations': [
            'Remove old leaves regularly',
            'Maintain consistent watering',
            'Apply balanced fertilizer',
            'Control weeds around plants'
        ],
        'pesticides': ['No treatment needed'],
        'organic_treatment': 'Organic fertilizers, mulching, proper care'
    },
    
    'Tomato___Bacterial_spot': {
        'description': 'Bacterial spot causes dark lesions on tomato leaves and fruit.',
        'symptoms': 'Small dark spots on leaves and fruit, yellowing, defoliation',
        'recommendations': [
            'Use certified disease-free seeds',
            'Rotate crops',
            'Apply copper bactericides',
            'Avoid overhead watering'
        ],
        'pesticides': [
            'Copper hydroxide',
            'Copper sulfate',
            'Streptomycin',
            'Kasugamycin'
        ],
        'organic_treatment': 'Copper soap, crop rotation, resistant varieties'
    },
    
    'Tomato___Early_blight': {
        'description': 'Early blight causes dark spots with concentric rings on tomato leaves.',
        'symptoms': 'Dark spots with target-like rings, yellowing leaves, fruit lesions',
        'recommendations': [
            'Remove infected plant debris',
            'Rotate crops',
            'Apply fungicides preventively',
            'Improve air circulation'
        ],
        'pesticides': [
            'Chlorothalonil',
            'Mancozeb',
            'Azoxystrobin',
            'Copper fungicides'
        ],
        'organic_treatment': 'Baking soda spray, neem oil, crop rotation'
    },
    
    'Tomato___Late_blight': {
        'description': 'Late blight can rapidly destroy tomato plants and fruit.',
        'symptoms': 'Water-soaked lesions, white growth on leaf undersides, fruit rot',
        'recommendations': [
            'Remove infected plants immediately',
            'Apply preventive fungicides',
            'Ensure good air circulation',
            'Avoid overhead watering'
        ],
        'pesticides': [
            'Mancozeb',
            'Chlorothalonil',
            'Metalaxyl',
            'Copper fungicides'
        ],
        'organic_treatment': 'Copper fungicides, resistant varieties, proper sanitation'
    },
    
    'Tomato___Leaf_Mold': {
        'description': 'Leaf mold causes yellowing and fuzzy growth on tomato leaf undersides.',
        'symptoms': 'Yellow spots on leaf tops, fuzzy growth on undersides, defoliation',
        'recommendations': [
            'Improve ventilation in greenhouses',
            'Reduce humidity',
            'Remove infected leaves',
            'Apply fungicides if needed'
        ],
        'pesticides': [
            'Chlorothalonil',
            'Mancozeb',
            'Azoxystrobin',
            'Copper fungicides'
        ],
        'organic_treatment': 'Improve ventilation, reduce humidity, neem oil'
    },
    
    'Tomato___Septoria_leaf_spot': {
        'description': 'Septoria leaf spot causes small spots with dark borders on tomato leaves.',
        'symptoms': 'Small circular spots with dark borders, yellowing leaves, defoliation',
        'recommendations': [
            'Remove infected lower leaves',
            'Mulch around plants',
            'Avoid overhead watering',
            'Apply fungicides preventively'
        ],
        'pesticides': [
            'Chlorothalonil',
            'Mancozeb',
            'Copper fungicides',
            'Azoxystrobin'
        ],
        'organic_treatment': 'Copper soap, proper mulching, crop rotation'
    },
    
    'Tomato___Spider_mites Two-spotted_spider_mite': {
        'description': 'Spider mites cause stippling and webbing on tomato plants.',
        'symptoms': 'Stippled yellowing leaves, fine webbing, leaf bronzing',
        'recommendations': [
            'Increase humidity around plants',
            'Use predatory mites',
            'Apply miticides if severe',
            'Remove heavily infested leaves'
        ],
        'pesticides': [
            'Abamectin',
            'Bifenthrin',
            'Spiromesifen',
            'Insecticidal soap'
        ],
        'organic_treatment': 'Neem oil, predatory mites, insecticidal soap'
    },
    
    'Tomato___Target_Spot': {
        'description': 'Target spot causes circular lesions with concentric rings on tomato plants.',
        'symptoms': 'Circular spots with concentric rings, yellowing, defoliation',
        'recommendations': [
            'Remove infected plant debris',
            'Rotate crops',
            'Apply fungicides preventively',
            'Ensure good air circulation'
        ],
        'pesticides': [
            'Chlorothalonil',
            'Azoxystrobin',
            'Mancozeb',
            'Copper fungicides'
        ],
        'organic_treatment': 'Copper soap, crop rotation, proper sanitation'
    },
    
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
        'description': 'Yellow leaf curl virus causes stunting and leaf curling in tomatoes.',
        'symptoms': 'Upward leaf curling, yellowing, stunted growth, reduced fruit',
        'recommendations': [
            'Control whitefly vectors',
            'Remove infected plants',
            'Use resistant varieties',
            'Install physical barriers'
        ],
        'pesticides': [
            'Imidacloprid (for whiteflies)',
            'Thiamethoxam',
            'Spiromesifen',
            'Insecticidal soap'
        ],
        'organic_treatment': 'Yellow sticky traps, resistant varieties, row covers'
    },
    
    'Tomato___Tomato_mosaic_virus': {
        'description': 'Tomato mosaic virus causes mottled patterns and distortion in tomato leaves.',
        'symptoms': 'Mottled light and dark green patterns, leaf distortion, stunting',
        'recommendations': [
            'Use virus-free seeds',
            'Sanitize tools and hands',
            'Remove infected plants',
            'Control aphid vectors'
        ],
        'pesticides': [
            'Imidacloprid (for aphids)',
            'Insecticidal soap',
            'No direct virus treatment available'
        ],
        'organic_treatment': 'Virus-free seeds, tool sanitation, aphid control'
    },
    
    'Tomato___healthy': {
        'description': 'Healthy tomato plant with normal growth and fruit development.',
        'symptoms': 'Green healthy foliage, normal fruit development, vigorous growth',
        'recommendations': [
            'Maintain consistent watering',
            'Provide adequate support',
            'Apply balanced fertilizer',
            'Monitor for pests and diseases'
        ],
        'pesticides': ['No treatment needed'],
        'organic_treatment': 'Organic fertilizers, companion planting, proper care'
    }
}

def get_disease_info(disease_name):
    """
    Get comprehensive information about a specific disease
    """
    return DISEASE_INFO.get(disease_name, {
        'description': 'Information not available for this condition.',
        'symptoms': 'Symptoms not documented.',
        'recommendations': ['Consult with local agricultural extension service'],
        'pesticides': ['Consult with agricultural specialist'],
        'organic_treatment': 'Seek organic farming guidance'
    })