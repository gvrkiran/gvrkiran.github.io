Workflow:

1. run "download_data.py" to download all samples listed in "VisualBMI_cvs_dump.txt" from imgur server
2. run "process_dataset.py" on the loaded images to split and filter out only samples with two different photos
3. manually process the output of 2. 
4. run "create_dataset.py" (change the path in the file to the valid samples from 3.) to create a consistent dataset with a description