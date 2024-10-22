import requests

# URL of the Express server
BASE_URL = 'http://localhost:3000/nutrients'  # Change this to your server's address if needed

# Function to make a GET request
def get_nutrients(product_type, calories, sugar, salt, serving_size, added_fat=None):
    params = {
        'productType': product_type,
        'calories': calories,
        'sugar': sugar,
        'salt': salt,
        'servingSize': serving_size
    }
    if added_fat is not None:
        params['addedFat'] = added_fat
    
    response = requests.get(BASE_URL, params=params)
    
    if response.status_code == 200:
        print("GET Response:")
        print(response.json())
    else:
        print("Error:", response.json())

# Example usage
if __name__ == '__main__':
    # Make a GET request for liquid product
    get_nutrients('liquid', 130, 7, 85, 100)
    
    # Make a GET request for solid product
    get_nutrients('solid', 130, 7, 85, 100, added_fat=3)
