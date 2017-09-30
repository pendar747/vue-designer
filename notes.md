# steps to transpile and run the imported program

1. Transpile the file:
    1.1 transpile every imported module
    1.2 If the imported file imports a new file go to step 1
    1.3 If the import is absolute extract from node modules
    1.3 Once done add result to a key map with file name as key

2. Inject all files into app except entry file

3. Inject the entry file a vue app