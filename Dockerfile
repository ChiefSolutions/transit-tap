# ==========================================
# STAGE 1: Build the Angular App
# ==========================================

FROM node:24-alpine AS angular-build
WORKDIR /app/client

# Copy package files and install dependencies
COPY web/package*.json ./
RUN rm -rf node_modules && npm install --no-save --no-audit --no-fund

# Copy the necessary files
COPY web/public/ ./public
COPY web/src/ ./src
COPY web/tsconfig.json web/tsconfig.app.json ./
COPY web/angular.json web/eslint.config.js ./

# Run the client production build
RUN npm run build -- --configuration=production

# ==========================================
# STAGE 2: Build and Publish the .NET App
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS dotnet-build
WORKDIR /src

# Copy the project file maintaining structure context, then restore
COPY ["api/TransitTap/Api/Api.csproj", "api/TransitTap/Api/"]
RUN dotnet restore "api/TransitTap/Api/Api.csproj"

# Copy the entire api tree at once (avoids flattening folders)
COPY api/TransitTap/Api/ api/TransitTap/Api/

# Step into the project folder to run the publish command
WORKDIR "/src/api/TransitTap/Api"
RUN dotnet publish "Api.csproj" -c Release -o /app/publish

# ==========================================
# STAGE 3: Final Runtime Bundle
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Copy the published .NET backend
COPY --from=dotnet-build /app/publish .

# Copy the Angular build output into the .NET wwwroot folder
COPY --from=angular-build /app/client/dist/browser ./wwwroot

ENTRYPOINT ["dotnet", "Api.dll"]