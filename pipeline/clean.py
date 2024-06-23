import os


def rename_files_in_subfolders(root_dir):
    for subdir, _, files in os.walk(root_dir):
        for file in files:
            if file.startswith("hw4-") and file.endswith(".png"):
                old_file_path = os.path.join(subdir, file)
                new_file_name = file.replace("hw4-", "hw-", 1)
                new_file_path = os.path.join(subdir, new_file_name)

                os.rename(old_file_path, new_file_path)
                print(f"Renamed: {old_file_path} -> {new_file_path}")


# Specify the root directory containing the subfolders and files
root_directory = 'D:\\ishtiqaq\\hw'

# Call the function to rename the files
rename_files_in_subfolders(root_directory)
