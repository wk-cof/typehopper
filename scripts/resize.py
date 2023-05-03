from PIL import Image
import os

def resize_images(image_list, width, height, output_folder):
    for image_path in image_list:
        img = Image.open(image_path)
        resized_img = img.resize((width, height), Image.ANTIALIAS)
        base_name = os.path.basename(image_path)
        output_path = os.path.join(output_folder, base_name)
        resized_img.save(output_path)
        print(f"Resized image saved to {output_path}")

def main():
    image_list = [
      'public/assets/Cartoon_Forest_BG_04/Layers/Sky.png',
      'public/assets/Cartoon_Forest_BG_04/Layers/BG_Decor.png',
      'public/assets/Cartoon_Forest_BG_04/Layers/Middle_Decor.png',
      'public/assets/Cartoon_Forest_BG_04/Layers/Foreground.png',
      'public/assets/Cartoon_Forest_BG_04/Layers/Ground.png'
    ]

    width = 785 #int(input("Enter the width: "))
    height = 384 #int(input("Enter the height: "))
    output_folder = input("Enter the output folder: ")

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    resize_images(image_list, width, height, output_folder)

if __name__ == "__main__":
    main()
