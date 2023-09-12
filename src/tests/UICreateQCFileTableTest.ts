
import { GraphQCFile, UICreateQCFileTable } from "../Graph/UICreateQCFileTable";

function GraphQCFileTest() {
    // create button element and add to #top-menu
    const button1 = document.createElement('button');            // create button element 
    button1.innerText = "QC-001";                               // set button text
    button1.addEventListener('click', function () {
        GraphQCFile(button1.innerText);
    });

    document.getElementById('top-menu')?.appendChild(button1);   // add button to top-menu

    const button2 = document.createElement('button');            // create button element 
    button2.innerText = "QC-002";                               // set button text
    button2.addEventListener('click', function () {
        GraphQCFile(button2.innerText);
    });

    document.getElementById('top-menu')?.appendChild(button2);   // add button to top-menu
}

function UICreateQCFileTableTest(parentContainerID: string) {
    const parent = document.getElementById(parentContainerID);
    const table = UICreateQCFileTable();
    parent?.appendChild(table);
};
UICreateQCFileTableTest('content');