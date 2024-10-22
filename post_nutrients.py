import requests

# URL of the Express server
BASE_URL = 'http://localhost:3000/nutrients'  # Change this to your server's address if needed

# Function to make a POST request
def post_nutrients(product_type, calories, sugar, salt, serving_size, added_fat=None):
    data = {
        'productType': product_type,
        'calories': calories,
        'sugar': sugar,
        'salt': salt,
        'servingSize': serving_size
    }
    if added_fat is not None:
        data['addedFat'] = added_fat

    response = requests.post(BASE_URL, json=data)
    
    if response.status_code == 200:
        print("POST Response:")
        print(response.json())
    else:
        print("Error:", response.json())

# Example usage
if __name__ == '__main__':
    # Make a POST request for liquid product
    post_nutrients('liquid', 130, 7, 85, 100)
    
    # Make a POST request for solid product
    post_nutrients('solid', 130, 7, 85, 100, added_fat=3)
