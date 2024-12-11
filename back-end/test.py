import unittest
import requests
import threading
import time

SERVER_URL = "http://localhost:8080/api"

class TestServer(unittest.TestCase):
    def setUp(self):
        #Create a basket before each test.
        response = requests.post(f"{SERVER_URL}/baskets")
        self.assertEqual(response.status_code, 201)
        self.basket = response.json()
        self.basket_code = self.basket["basket_code"]

        #Creating a new basket
    def test_create_basket(self):
        response = requests.post(f"{SERVER_URL}/baskets")
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIn("basket_id", data)
        self.assertIn("basket_code", data)

        #Joining a basket
    def test_join_basket(self):
        payload = {"name": "John Doe"}
        response = requests.post(f"{SERVER_URL}/baskets/{self.basket_code}/participants", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())

        #Test two participants with the same name joining the basket.
    def test_join_basket_with_same_name(self):
        payload = {"name": "John Doe"}

        #First user joins
        response1 = requests.post(f"{SERVER_URL}/baskets/{self.basket_code}/participants", json=payload)
        self.assertEqual(response1.status_code, 200)

        #Second user with the same name joins
        response2 = requests.post(f"{SERVER_URL}/baskets/{self.basket_code}/participants", json=payload)
        self.assertEqual(response2.status_code, 200)

        #Test two users trying to join the basket simultaneously.
    def test_concurrent_participant_join(self):
        payload1 = {"name": "Alice"}
        payload2 = {"name": "Bob"}

        def join_participant(payload):
            response = requests.post(f"{SERVER_URL}/baskets/{self.basket_code}/participants", json=payload)
            self.assertEqual(response.status_code, 200)

        thread1 = threading.Thread(target=join_participant, args=(payload1,))
        thread2 = threading.Thread(target=join_participant, args=(payload2,))

        thread1.start()
        thread2.start()

        thread1.join()
        thread2.join()

        #Test adding an item to the basket.
    def test_add_item(self):
        participant_payload = {"name": "John Doe"}
        requests.post(f"{SERVER_URL}/baskets/{self.basket_code}/participants", json=participant_payload)

        item_payload = {"product": "Apple", "price": 1.5, "quantity": 3, "added_by": "John Doe"}
        response = requests.post(f"{SERVER_URL}/baskets/{self.basket_code}/items", json=item_payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())

        #Test two users adding items to the basket simultaneously.
    def test_concurrent_item_addition(self):
        participant_payload = {"name": "John Doe"}
        requests.post(f"{SERVER_URL}/baskets/{self.basket_code}/participants", json=participant_payload)

        item_payload1 = {"product": "Banana", "price": 0.5, "quantity": 5, "added_by": "John Doe"}
        item_payload2 = {"product": "Orange", "price": 1.0, "quantity": 4, "added_by": "John Doe"}

        def add_item(payload):
            response = requests.post(f"{SERVER_URL}/baskets/{self.basket_code}/items", json=payload)
            self.assertEqual(response.status_code, 200)

        thread1 = threading.Thread(target=add_item, args=(item_payload1,))
        thread2 = threading.Thread(target=add_item, args=(item_payload2,))

        thread1.start()
        thread2.start()

        thread1.join()
        thread2.join()

        #Test deleting an item from the basket.
    def test_delete_item(self):
        participant_payload = {"name": "John Doe"}
        requests.post(f"{SERVER_URL}/baskets/{self.basket_code}/participants", json=participant_payload)

        item_payload = {"product": "Apple", "price": 1.5, "quantity": 3, "added_by": "John Doe"}
        add_response = requests.post(f"{SERVER_URL}/baskets/{self.basket_code}/items", json=item_payload)
        self.assertEqual(add_response.status_code, 200)

        #Fetch items to get the item ID
        get_response = requests.get(f"{SERVER_URL}/baskets/{self.basket_code}/items")
        self.assertEqual(get_response.status_code, 200)
        items = get_response.json()["items"]
        item_id = items[0]["id"]

        #Delete the item
        delete_response = requests.delete(f"{SERVER_URL}/baskets/{self.basket_code}/items/{item_id}")
        self.assertEqual(delete_response.status_code, 200)
        self.assertIn("message", delete_response.json())

#Only run test suite if called directly (not imported)
if __name__ == "__main__":
    unittest.main()
