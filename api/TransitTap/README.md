# ⚙️ TransitTap Backend (API)

This is the processing core of TransitTap, built with **.NET 10** and C#. It is responsible for simulating transit taps
and exposing data streams efficiently.

## 🛠️ Local Development Commands

Execute these commands from within your API source directory (`/api/TransitTap`):

* **Restore Dependencies:** `dotnet restore`
* **Build the Project:** `dotnet build`
* **Run the API locally:** `dotnet run`
* **Run Backend Tests:** `dotnet test` (if applicable)

## 📡 API Endpoint Architecture

Once running, the API self-documents its available endpoints via OpenAPI/Swagger/Scalar interfaces. You can view the
full documentation dashboard locally by navigating to the address outputted in your console (typically
`http://localhost:5000/scalar` or similar depending on configuration).