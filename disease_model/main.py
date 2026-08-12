import streamlit as st
import tensorflow as tf
import numpy as np
from disease_info import get_disease_info

#Tensorflow Model Prediction
def model_prediction(test_image):
    model  = tf.keras.models.load_model('trained_model.h5')
    image = tf.keras.preprocessing.image.load_img(test_image,target_size=(128, 128))
    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    input_arr = np.array([input_arr]) #Convert single image to a batch
    prediction = model.predict(input_arr)
    result_index = np.argmax(prediction)
    return result_index

#Sidebar
st.sidebar.title("Dashboard")
app_mode = st.sidebar.selectbox("Select Page",["Home","About","Disease Recognition"])

#Home Page
if(app_mode=="Home"):
    st.header("PLANT DISEASE RECOGNITION SYSTEM")
    image_path = "home_page.jpeg"
    st.image(image_path,width='stretch')
    st.markdown("""
    Welcome to the Plant Disease Recognition System! 🌿🔍
    
    Our mission is to help in identifying plant diseases efficiently. Upload an image of a plant, and our system will analyze it to detect any signs of diseases. Get comprehensive treatment recommendations and pesticide suggestions. Together, let's protect our crops and ensure a healthier harvest!

    ### How It Works
    1. **Upload Image:** Go to the **Disease Recognition** page and upload an image of a plant with suspected diseases.
    2. **Analysis:** Our system will process the image using advanced algorithms to identify potential diseases.
    3. **Comprehensive Results:** View detailed disease information, management recommendations, pesticide suggestions, and organic treatment alternatives.

    ### Why Choose Us?
    - **Accuracy:** Our system utilizes state-of-the-art machine learning techniques for accurate disease detection.
    - **Comprehensive Treatment Guide:** Get detailed pesticide recommendations and organic treatment alternatives.
    - **Expert Knowledge:** Access to professional agricultural advice and management practices.
    - **User-Friendly:** Simple and intuitive interface for seamless user experience.
    - **Fast and Efficient:** Receive results in seconds, allowing for quick decision-making.
    - **Safety First:** Includes important safety warnings and guidelines for pesticide use.

    ### Get Started
    Click on the **Disease Recognition** page in the sidebar to upload an image and experience the power of our Plant Disease Recognition System!

    ### About Us
    Learn more about the project, our team, and our goals on the **About** page.
""")

#About Page
elif(app_mode=="About"):
    st.header("About")
    st.markdown("""
    #### About Dataset
    This dataset is recreated using offline augmentation from the original dataset. The original dataset can be found on this github repo. This dataset consists of about 87K rgb images of healthy and diseased crop leaves which is categorized into 38 different classes. The total dataset is divided into 80/20 ratio of training and validation set preserving the directory structure. A new directory containing 33 test images is created later for prediction purpose.
    #### Content
    1. Train (70295 images)
    2. Valid (17572 image)
    3. Test (33 images)
""")
    
#Prediction Page
elif(app_mode=="Disease Recognition"):
    st.header("Disease Recognition")
    test_image = st.file_uploader("Choose an Image:")
    if(st.button("Show Image")):
        st.image(test_image,width='stretch')
    #Predict Button
    if(st.button("Predict")):
        with st.spinner("Please Wait.."):
            st.write("Our Prediction")
            result_index = model_prediction(test_image)
            #Define Class
            class_name = ['Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy']
            # Get the predicted disease name
            predicted_disease = class_name[result_index]
            
            # Get comprehensive disease information
            disease_info = get_disease_info(predicted_disease)
            
            # Display prediction result with enhanced formatting
            st.success(f"🔬 **Prediction Result:** {predicted_disease.replace('_', ' ').title()}")
            
            # Create columns for better layout
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("📋 Disease Information")
                st.write(f"**Description:** {disease_info['description']}")
                st.write(f"**Symptoms:** {disease_info['symptoms']}")
                
                st.subheader("🌱 Management Recommendations")
                for i, rec in enumerate(disease_info['recommendations'], 1):
                    st.write(f"{i}. {rec}")
            
            with col2:
                st.subheader("🧪 Chemical Treatment")
                st.write("**Recommended Pesticides:**")
                for i, pesticide in enumerate(disease_info['pesticides'], 1):
                    st.write(f"{i}. {pesticide}")
                
                st.subheader("🌿 Organic Treatment")
                st.info(f"💡 **Natural Alternative:** {disease_info['organic_treatment']}")
            
            # Additional warnings and notes
            if predicted_disease.endswith('healthy'):
                st.balloons()
                st.success("🎉 Great news! Your plant appears to be healthy. Keep up the good care!")
            else:
                st.warning("⚠️ **Important:** Always consult with local agricultural experts before applying any treatments. Follow label instructions and safety guidelines when using pesticides.")
                
                # Severity indicator
                severity_diseases = ['Late_blight', 'Haunglongbing_(Citrus_greening)', 'Black_rot']
                if any(severe in predicted_disease for severe in severity_diseases):
                    st.error("🚨 **HIGH PRIORITY:** This is a serious disease that requires immediate attention!")
            
            # Additional tips
            st.markdown("---")
            st.subheader("💡 General Tips")
            tips_col1, tips_col2 = st.columns(2)
            
            with tips_col1:
                st.markdown("""
                **Prevention is Key:**
                - Regular monitoring
                - Proper plant spacing
                - Good sanitation practices
                - Avoid overhead watering
                """)
            
            with tips_col2:
                st.markdown("""
                **When to Seek Help:**
                - Disease spreads rapidly
                - Multiple plants affected
                - Uncertain about treatment
                - Organic methods preferred
                """)
