---
id: api
title: Pet Adoption API Endpoints
sidebar_label: API
---

# Pet Adoption API Endpoints

This document provides an overview of the available endpoints in the Pet Adoption API, including descriptions, request formats, and responses.

## Base URL

The base URL for all API endpoints is:
http://localhost:3000/

## API Endpoints

### Get All Pets

- **Endpoint**: `GET /pets`
- **Description**: Retrieves a list of all pets.
- **Responses**:
    - `200 OK`: Returns a list of pets.
    - `204 No Content`: No pets found.

### Get Pet by ID

- **Endpoint**: `GET /pets/pet/{id}`
- **Description**: Retrieves a pet by its ID.
- **Parameters**:
    - `id` (string): The ID of the pet.
- **Responses**:
    - `200 OK`: Returns the pet object.
    - `404 Not Found`: If the pet with the given ID does not exist.

### Create Pet

- **Endpoint**: `POST /pets`
- **Description**: Creates a new pet record.
- **Request Body**:
    ```json
    {
      "name": "string",
      "age": "number",
      "race": "string"
    }
    ```
- **Responses**:
    - `201 Created`: Returns the created pet object.
    - `400 Bad Request`: If required fields are missing.
    - `409 Conflict`: If a pet with the same name already exists.

### Update Pet

- **Endpoint**: `PUT /pets/pet/{id}`
- **Description**: Updates an existing pet record by ID.
- **Parameters**:
    - `id` (string): The ID of the pet.
- **Request Body**:
    ```json
    {
      "name": "string",
      "age": "number",
      "race": "string"
    }
    ```
- **Responses**:
    - `200 OK`: Returns the updated pet object.
    - `404 Not Found`: If the pet with the given ID does not exist.

### Delete Pet

- **Endpoint**: `DELETE /pets/pet/{id}`
- **Description**: Deletes a pet record by ID.
- **Parameters**:
    - `id` (string): The ID of the pet.
- **Responses**:
    - `200 OK`: Confirmation message.
    - `404 Not Found`: If the pet with the given ID does not exist.





## API Documentation

For more details about the API, you can visit the [Swagger UI](http://localhost:3000/api-docs) for the Pet Adoption API.

## Links

- [GitHub Repository](https://github.com/yourusername/pet-adoption-api)
- [Installation Guide](https://your-installation-guide-url)