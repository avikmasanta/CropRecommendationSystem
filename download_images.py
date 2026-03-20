import os
import urllib.request
import time

CROP_IMAGES = {
    'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=400&h=280&fit=crop',
    'wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=280&fit=crop',
    'jute': 'https://images.unsplash.com/photo-1530510526725-3cd9ce6e98b0?w=400&h=280&fit=crop',
    'cotton': 'https://images.unsplash.com/photo-1596763615456-11f87b8d80c3?w=400&h=280&fit=crop',
    'maize': 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=400&h=280&fit=crop',
    'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcc6?w=400&h=280&fit=crop',
    'grapes': 'https://images.unsplash.com/photo-1596362540880-5a33ebd6c3ff?w=400&h=280&fit=crop',
    'mango': 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=280&fit=crop',
    'orange': 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=280&fit=crop',
    'banana': 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&h=280&fit=crop',
    'papaya': 'https://images.unsplash.com/photo-1517282009859-f000ef1b44cb?w=400&h=280&fit=crop',
    'watermelon': 'https://images.unsplash.com/photo-1587049352847-4d4b126a51d4?w=400&h=280&fit=crop',
    'muskmelon': 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=400&h=280&fit=crop',
    'pomegranate': 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&h=280&fit=crop',
    'coconut': 'https://images.unsplash.com/photo-1510257321683-1dfb003c9429?w=400&h=280&fit=crop',
    'coffee': 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=280&fit=crop',
    'chickpea': 'https://images.unsplash.com/photo-1615486171448-4fdcbef516ce?w=400&h=280&fit=crop',
    'kidneybeans': 'https://images.unsplash.com/photo-1551185568-12c5b369c7cc?w=400&h=280&fit=crop',
    'lentil': 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400&h=280&fit=crop',
    'mungbean': 'https://images.unsplash.com/photo-1598425237654-4eccabfe2b5a?w=400&h=280&fit=crop',
    'blackgram': 'https://images.unsplash.com/photo-1628189674068-d06efce83cf4?w=400&h=280&fit=crop',
    'pigeonpeas': 'https://images.unsplash.com/photo-1582282577239-df08e73fc5f8?w=400&h=280&fit=crop',
    'mothbeans': 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=400&h=280&fit=crop',
    'fallback': 'https://images.unsplash.com/photo-1592494804071-faea15d93a8a?w=400&h=280&fit=crop'
}

ASSETS = {
    'hero1': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=400&fit=crop',
    'hero2': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop',
    'hero3': 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&h=400&fit=crop',
    'author': 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=80&h=80&fit=crop&crop=faces'
}

def download_image(url, filepath, name):
    if not os.path.exists(filepath):
        print(f"Downloading {filepath}...")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
            with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
                out_file.write(response.read())
            time.sleep(1) 
        except Exception as e:
            print(f"Failed to download {url}, attempting fallback: {e}")
            try:
                # Fallback to UI Avatars if Unsplash gives 403 or 404
                fallback_url = f"https://ui-avatars.com/api/?name={urllib.parse.quote(name)}&background=random&size=400"
                req2 = urllib.request.Request(fallback_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req2) as response, open(filepath, 'wb') as out_file:
                    out_file.write(response.read())
                time.sleep(0.5)
            except Exception as e2:
                print(f"Total failure for {name}: {e2}")

    else:
        print(f"Already exists: {filepath}")

def main():
    crops_dir = os.path.join('frontend', 'public', 'crops')
    assets_dir = os.path.join('frontend', 'public', 'assets')

    os.makedirs(crops_dir, exist_ok=True)
    os.makedirs(assets_dir, exist_ok=True)

    print("Downloading crop images...")
    for crop, url in CROP_IMAGES.items():
        filepath = os.path.join(crops_dir, f"{crop}.jpg")
        download_image(url, filepath, crop)

    print("\nDownloading asset images...")
    for asset, url in ASSETS.items():
        filepath = os.path.join(assets_dir, f"{asset}.jpg")
        download_image(url, filepath, asset)

    print("Done downloading all images.")

if __name__ == '__main__':
    main()
