#!/bin/bash

# WMS-FI Database Setup Script
# This script initializes the local PostgreSQL database with WMS schema and seed data

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Default values
DB_NAME=${DB_NAME:-"wms-fi"}
DB_USER=${DB_USER:-"postgres"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}

echo "🏗️  Setting up WMS-FI Database..."
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Host: $DB_HOST:$DB_PORT"
echo ""

# Check if PostgreSQL is running
echo "📡 Checking PostgreSQL connection..."
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; then
    echo "❌ PostgreSQL is not running or not accessible"
    echo "Please ensure PostgreSQL is running on $DB_HOST:$DB_PORT"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Check if database exists
echo "🔍 Checking if database '$DB_NAME' exists..."
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "⚠️  Database '$DB_NAME' already exists"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
    else
        echo "ℹ️  Using existing database. Only running schema updates..."
    fi
fi

# Create database if it doesn't exist
if ! psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "🆕 Creating database '$DB_NAME'..."
    createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
    echo "✅ Database created"
fi

# Run schema
echo "🏗️  Setting up database schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/schema.sql

echo "✅ Schema created successfully"

# Run seed data
echo "🌱 Loading seed data..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/seed_data.sql

echo "✅ Seed data loaded successfully"

# Display summary
echo ""
echo "🎉 Database setup completed!"
echo ""
echo "📊 Summary:"
echo "   Database: $DB_NAME"
echo "   Host: $DB_HOST:$DB_PORT"
echo "   User: $DB_USER"
echo ""
echo "🔗 Connection string:"
echo "   postgresql://$DB_USER:****@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo "📖 Sample data includes:"
echo "   - 1 Company (WMS Philippines Inc.)"
echo "   - 1 Warehouse with multiple locations"
echo "   - 10 Sample items (food and household)"
echo "   - 3 Vendors and 3 Customers"
echo "   - Sample ASN and SO records"
echo "   - Initial inventory data"
echo ""
echo "🚀 Next steps:"
echo "   1. Copy .env.example to .env and update DB_PASSWORD"
echo "   2. Run: docker-compose up postgrest"
echo "   3. Test API: curl http://localhost:3000/items"
echo ""

# Test basic queries
echo "🧪 Testing database with sample queries..."
echo ""

echo "📦 Item count:"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as total_items FROM items;"

echo ""
echo "🏢 Warehouse locations:"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT location_type, COUNT(*) as count FROM locations GROUP BY location_type;"

echo ""
echo "📋 Current inventory summary:"
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as items_with_stock FROM inventory_balances WHERE total_quantity > 0;"

echo ""
echo "✅ Database is ready for use!"