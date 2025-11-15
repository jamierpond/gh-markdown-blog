#!/bin/bash

# Test the three OG image routes locally

echo "Testing /og/article route..."
curl -I "http://jamierpond.localtest.me:3001/og/article?title=My%20Awesome%20Article&author=Jamie%20Pond&username=jamierpond&date=2024-01-15"

echo -e "\n\nTesting /og/user-home route..."
curl -I "http://jamierpond.localtest.me:3001/og/user-home?name=Jamie%20Pond&username=jamierpond&bio=Full%20stack%20developer%20and%20open%20source%20enthusiast&avatar=https://github.com/jamierpond.png"

echo -e "\n\nTesting /og/madea-home route..."
curl -I "http://localhost:3001/og/madea-home"

echo -e "\n\nTo view the images in your browser:"
echo "Article: http://jamierpond.localtest.me:3001/og/article?title=My%20Awesome%20Article&author=Jamie%20Pond&username=jamierpond&date=2024-01-15"
echo "User Home: http://jamierpond.localtest.me:3001/og/user-home?name=Jamie%20Pond&username=jamierpond&bio=Full%20stack%20developer&avatar=https://github.com/jamierpond.png"
echo "Madea Home: http://localhost:3001/og/madea-home"
