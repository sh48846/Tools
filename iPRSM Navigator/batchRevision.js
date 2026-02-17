const { Builder, By, Key, until, promise} = require('selenium-webdriver')
const chrome = require("selenium-webdriver/chrome")
const fs = require("fs")
const path = require("path")
const XLSX = require('xlsx');

const REMOTE_PORT = 9222; // choose a port for remote debugging
let driver

async function main() {
    // Chrome options
    const options = new chrome.Options()
        .addArguments(
            "user-data-dir=C:/SeleniumProfile", // reuse existing profile
            "--disable-infobars",
            "--log-level=3",
            `--remote-debugging-port=${REMOTE_PORT}`,
            //'--no-sandbox'
        );

    let driver

    try{
        driver = await new Builder()
            .forBrowser("chrome")
            .usingServer(`http://localhost:${REMOTE_PORT}`)
            .setChromeOptions(options)
            .build();

    } catch (err) {
        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
    } 

    // Get all current tabs/windows
    let handles = await driver.getAllWindowHandles();

    for (const handle of handles) {
        await driver.switchTo().window(handle);
        const url = await driver.getCurrentUrl();
        if (url === "about:blank" || url === "") {
            await driver.close();
        }
    }

    handles = await driver.getAllWindowHandles();

    await driver.switchTo().newWindow("tab");

    // Navigate to IP-RSM in the new tab
    await driver.get("https://www.iprsm.com/");
    await driver.manage().setTimeouts({ script: 1000000 });

    // Maximize current window/tab
    const currentHandle = await driver.getWindowHandle();
    await driver.switchTo().window(currentHandle);
    await driver.manage().window().maximize();
    
    let fullOptions = [];

    if (typeof process.pkg !== 'undefined') {
        __dirname = path.dirname(process.execPath);
        process.chdir(__dirname); // Change to EXE directory
    }
    
    const filePath = path.resolve(__dirname, "localMemory.json")
    if (fs.existsSync(filePath)) {
        fullOptions = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    }

    await driver.executeScript((opts) => {
        localStorage.setItem("optionsBrowserMemory", JSON.stringify(opts))
        console.log("Saved fullOptions to localStorage:", opts)
    }, fullOptions)

    //makes html for popup to get creds
    async function getCredentialsFromUser() {
        return await driver.executeAsyncScript(`
            const callback = arguments[arguments.length - 1]

            // Load previous saved values
            const saved = JSON.parse(localStorage.getItem("seleniumCreds") || "{}")
            const fullOptions = JSON.parse(localStorage.getItem("optionsBrowserMemory") || "[]")
            window._seleniumCreds = saved
            window._optionsBrowserMemory = fullOptions
            console.log("All previously saved creds:", JSON.stringify(saved, null, 2));
            console.log("All saved options:", JSON.stringify(fullOptions, null, 2));


            // Create overlay
            const overlay = document.createElement("div")
            overlay.id = "selenium-overlay"
            overlay.style.cssText = \`
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
            \`

            const box = document.createElement("div")
            box.style.cssText = \`
                background: rgba(255, 255, 255, 1);
                padding: 24px;
                border-radius: 50px;
                border: black 3px solid;
                width: 500px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                font-family: "Tahoma", sans-serif;
                box-shadow: 0 16px 48px rgba(0,0,0,0.5); 
            \`

            // Autofill saved values, password always blank
            box.innerHTML = \`
                <label>Site Code <input id="sc" value="\${saved.siteCode || ''}" /></label>
                <label>Username <input id="un" value="\${saved.username || ''}" /></label>
                <label>Password <input id="pw" value="\${saved.password || ''}" type="password" /></label>
                <label>Plant <input id="pt" value="\${saved.plant || ''}" /></label>
                <label>Unit <input id="ut" value="\${saved.unit || ''}" /></label>
                <button id="systems">See Systems</button>
                <button id="submit">Search</button>
                
            \`

            box.querySelectorAll("label").forEach(label => {
                label.style.cssText = \`
                    display: flex;
                    flex-direction: row;   
                    align-items: center;  
                    justify-content: right;
                    background-color: rgba(180, 200, 255, 0.9);
                    font-weight: bold;
                    font-size: 24px;
                    border-radius: 40px;
                    gap: 20px;                 
                    width: 100%;
                \`
            })

            box.querySelectorAll("input").forEach(input => {
                input.style.cssText = \`
                    flex: 1;              
                    max-width: 350px;
                    width: 100%;          
                    box-sizing: border-box;   
                    padding: 2px 2px;
                    font-size: 24;
                \`
            })
            

            box.querySelector("#sc").focus()
            
            overlay.appendChild(box)
            document.body.appendChild(overlay)

            const submitBtn = box.querySelector("#submit")
            submitBtn.style.cssText = \`
                padding: 10px 16px;                 
                font-size: 30px;                    
                width: 100%;                        
                border-radius: 999px;               
                background-color: black;            
                color: white;                       
                border: none;                       
                cursor: pointer;                    
                font-family: "Tahoma", sans-serif; 
                text-align: center;
                //border: white 3px solid;
            \`

            const systemsBtn = box.querySelector("#systems")
            systemsBtn.style.cssText = \`
                padding: 10px 16px;                 
                font-size: 30px;                    
                width: 100%;                        
                border-radius: 999px;               
                background-color: #ddd;           
                color: "#666";                       
                font-weight: bold;
                border: none;                       
                cursor: pointer;                    
                font-family: "Tahoma", sans-serif; 
                text-align: center;
                \`

            const style = document.createElement("style");
            
            style.textContent = \`
            .rainbow {
                background: linear-gradient(
                    270deg,
                   blue, cyan, blue
                );
                opacity: 0.9;
                background-size: 40% 40%;
                font-family: "Tahoma", sans-serif;
                animation: rainbow 120s linear infinite;
                color: white;
                font-weight: 900;
                border: none;
                -webkit-text-fill-color: black;   /* Inner text color */
                -webkit-text-stroke: 0.5px currentColor;  /* Uses text color as outline */
            }

            @keyframes rainbow {
                from { background-position: 0% 50%; }
                to   { background-position: 200% 50%; }
            }
            \`

            document.head.appendChild(style);

            systemsBtn.classList.add("rainbow");  /*remove this line to remove rainbow button*/
            overlay.classList.add("rainbow");     /*remove this line to make less ugly*/
            console.log("adding rainbow style")
                
            const styleTitle = document.createElement('style')

            styleTitle.textContent = \`
                .title-style {
                    font-family: "Tahoma", sans-serif;
                    font-size: 40px;               
                    font-weight: 900;               
                    text-shadow: 
                        1px 1px 0 black, 
                        3px -3px 0 currentColor, 
                        -3px 3px 0 currentColor, 
                        -3px -3px 0 currentColor;
                    text-align: center;
                    margin-bottom: 6px;            
                    
                    background: linear-gradient(270deg, blue, cyan, blue);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    color: transparent;
                }
            \`
            document.head.appendChild(styleTitle);

            // Create title element
            const title = document.createElement("div")
            title.textContent = "iPRSM Navigator"  
            title.classList.add("title-style");
            box.prepend(title)
            //title.classList.add("rainbow")

            // Get the Unit input and Plant input
            const unitInput = box.querySelector("#ut");
            const plantInput = box.querySelector("#pt");

            let unitList = box.querySelector("#ut-options");
            if (!unitList) {
                unitList = document.createElement("dataList");
                unitList.id = "ut-options";
                box.appendChild(unitList);
            }
            unitInput.setAttribute("list", "ut-options");

            let plantList = box.querySelector("#pt-options");
            if (!plantList) {
                plantList = document.createElement("dataList");
                plantList.id = "pt-options";
                box.appendChild(plantList);
            }
            // Attach plantList to input
            plantInput.setAttribute("list", "pt-options");

            const unitSelect = document.createElement("select");
            unitSelect.id = "ut-select";
            unitSelect.style.fontSize = "24px";
            unitSelect.style.width = "100%";
            unitSelect.style.marginBottom = "0px"; // spacing below select box

            
            const plantSelect = document.createElement("select");
            plantSelect.id = "pt-select";
            plantSelect.style.fontSize = "24px";
            plantSelect.style.width = "100%";
            //plantSelect.style.marginBottom = "0px"; // spacing below select box
            


            function updateUnitList() {

                updateSeleniumCreds()

                const creds = window._seleniumCreds;
                if (!creds) return;

                const siteCode = box.querySelector("#sc").value.trim();
                const plantValue = plantInput.value.trim();
                const savedUnitValue = saved.unit || "";
                unitList.innerHTML = "";
                unitSelect.innerHTML = "";
                console.log("Saved unit value:", savedUnitValue);
                console.log("Filtering unit options for plant:", plantValue);

                const systemsArray = fullOptions.filter(o =>
                    o.siteCode === creds.siteCode &&
                    o.plant === creds.plant &&
                    o.unit === creds.unit &&
                    o.system &&
                    o.systemValue
                );

                console.log("Creds:", creds)

                if (systemsArray.length === 0 && creds.unit !== "") {
                    disableSystemsButton();
                    showSystemsError("Search units to populate systems");
                    console.warn("No systems found for this unit/plant/siteCode.");

                    //style(rain)
                }else{
                    enableSystemsButton()
                    console.log("Enabling system search")
                    clearError()
                    if(creds.unit == ""){disableSystemsButton();}
                }

                // Filter options by plant
                const filteredOptions = [
                    ...new Set(
                        fullOptions
                            .filter(o => o.plant === plantValue && o.siteCode === siteCode)
                            .map(o => o.unit)
                            .filter(Boolean)
                    )
                ];


                console.log("Unit options filtered by plant:", JSON.stringify(filteredOptions, null, 2));

                // Clear existing options

                const sortedOptions = [...filteredOptions].sort((a, b) => 
                    a.localeCompare(b, undefined, { sensitivity: 'base' })
                )

                // Append filtered options
                sortedOptions.forEach(unit => {
                    const dlOpt = document.createElement("option");
                    dlOpt.value = unit;
                    unitList.appendChild(dlOpt);

                    // select option
                    const selOpt = document.createElement("option");
                    selOpt.value = unit;
                    selOpt.textContent = unit; // REQUIRED
                    unitSelect.appendChild(selOpt);
                });

                [unitInput, plantInput].forEach(el => {
                    el.style.fontWeight = "bold";
                    el.style.color = "#0080ff";
                });
                
                // add empty selection at top and delete extras
                if (!unitSelect.options.length || unitSelect.options[0].value !== "") {
                    const emptySel = document.createElement("option");
                    emptySel.value = "";
                    emptySel.textContent = "";
                    unitSelect.insertBefore(emptySel, unitSelect.firstChild);
                }

                // Add saved unit at top if it exists and isn't already in the list
                if (savedUnitValue && !filteredOptions.includes(savedUnitValue)) {
                    const option = document.createElement("option");
                    option.value = savedUnitValue;
                    option.textContent = savedUnitValue;
                    unitList.insertBefore(option, unitList.firstChild);
                }

                for (let i = unitSelect.options.length - 1; i > 0; i--) {
                    if (unitSelect.options[i].value === "") {
                        unitSelect.remove(i);
                    }
                }

                unitSelect.value = unitInput.value || "";
            }

            function updatePlantList() {
                updateSeleniumCreds()
                const creds = window._seleniumCreds;
                if (!creds) return;

                const siteCode = box.querySelector("#sc").value.trim();
                const savedPlantValue = saved.plant || "";
                plantList.innerHTML = "";
                plantSelect.innerHTML = "";

                const filteredOptions = [...new Set(
                    fullOptions
                        .filter(o => o.siteCode === siteCode)
                        .map(o => o.plant)
                        .filter(Boolean)
                )];

                const sortedOptions = [...filteredOptions].sort((a, b) => 
                a.localeCompare(b, undefined, { sensitivity: 'base' })
                );

                sortedOptions.forEach(plant => {
                    const dlOpt = document.createElement("option");
                    dlOpt.value = plant;
                    plantList.appendChild(dlOpt);

                    const selOpt = document.createElement("option");
                    selOpt.value = plant;
                    selOpt.textContent = plant;
                    plantSelect.appendChild(selOpt);
                });

                // add empty selection at top and delete extras
                if (!plantSelect.options.length || plantSelect.options[0].value !== "") {
                    const emptySel = document.createElement("option");
                    emptySel.value = "";
                    emptySel.textContent = "";
                    plantSelect.insertBefore(emptySel, plantSelect.firstChild);
                }

                for (let i = plantSelect.options.length - 1; i > 0; i--) {
                    if (plantSelect.options[i].value === "") {
                        plantSelect.remove(i);
                    }
                }

                // Add saved plant at top if it exists and isn't already in the list
                if (savedPlantValue && !filteredOptions.includes(savedPlantValue)) {
                    const savedPlant = document.createElement("option");
                    savedPlant.value = savedPlantValue;
                    savedPlant.textContent = savedPlantValue;
                    plantList.insertBefore(savedPlant, plantList.firstChild);
                }

                plantSelect.value = plantInput.value || "";
            }





            // Update dynamically whenever input changes

            unitInput.addEventListener("input", updateUnitList);
            unitSelect.addEventListener("click", updateUnitList);

            const siteCode = box.querySelector("#sc");
            siteCode.addEventListener("input", () => {
                updateUnitList()
                updatePlantList()   
                unitInput.value = "";
                unitInput.dataset.value = "";
                unitSelect.value = "";
                plantInput.value = "";
                plantInput.dataset.value = "";
                plantSelect.value = "";
            })


            plantInput.addEventListener("input", () => {
                updatePlantList();
                updateUnitList();
                const plantValue = plantInput.value.trim();
                const currentUnit = unitInput.value.trim();
                const belongsToPlant = fullOptions.some(o => o.unit === currentUnit && o.plant === plantValue);

                if (!belongsToPlant) {
                    unitInput.value = "";
                    unitInput.dataset.value = "";
                    unitSelect.value = "";
                }
            });

            plantSelect.addEventListener("click", () => {
                updatePlantList();
                updateUnitList();
                const plantValue = plantInput.value.trim();
                const currentUnit = unitInput.value.trim();
                const belongsToPlant = fullOptions.some(o => o.unit === currentUnit && o.plant === plantValue);

                if (!belongsToPlant) {
                    unitInput.value = "";
                    unitInput.dataset.value = "";
                    unitSelect.value = "";
                }
            });

            unitSelect.value = unitInput.value || "";
            plantSelect.value = plantInput.value || "";

            // --- Create a visible dropdown that looks like an input ---
            const unitWrapper = document.createElement("div");
            unitWrapper.style.position = "relative";
            unitWrapper.style.display = "fixed";
            unitWrapper.style.flexDirection = "column";
            unitWrapper.style.maxWidth = "350px";
            unitWrapper.style.gap = "0px";

            // Insert wrapper in place of original input
            unitInput.parentElement.insertBefore(unitWrapper, unitInput);
            unitWrapper.appendChild(unitInput); // move input into wrapper
            unitWrapper.appendChild(unitSelect); // put dropdown above input

            // --- Create a visible dropdown that looks like an input ---
            const plantWrapper = document.createElement("div");
            plantWrapper.style.position = "relative";
            plantWrapper.style.display = "fixed";
            plantWrapper.style.flexDirection = "column";
            plantWrapper.style.maxWidth = "350px";
            plantWrapper.style.gap = "0px";

            // Insert wrapper in place of original input
            plantInput.parentElement.insertBefore(plantWrapper, plantInput);
            plantWrapper.appendChild(plantInput); // move input into wrapper
            plantWrapper.appendChild(plantSelect); // put dropdown above input
        

            // Make unit input editable by syncing typing with select
            unitInput.addEventListener("input", () => {
                let found = false;
                for (const opt of unitSelect.options) {
                    if (opt.textContent.toLowerCase() === unitInput.value.trim().toLowerCase()) {
                        unitSelect.value = opt.value;
                        found = true;
                        break;
                    }
                }
                if (!found) unitSelect.value = ""; // custom typed value
            });

            // Sync unit select change back to text input
            unitSelect.addEventListener("change", () => {
                unitInput.value = unitSelect.value || "";
                [unitInput, plantInput].forEach(el => {
                    el.style.fontWeight = "bold";
                    el.style.color = "#0080ff";
                });
            });

            // Make plant input editable by syncing typing with select
            plantInput.addEventListener("input", () => {
                let found = false;
                for (const opt of plantSelect.options) {
                    if (opt.textContent.toLowerCase() === plantInput.value.trim().toLowerCase()) {
                        plantSelect.value = opt.value;
                        found = true;
                        break;
                    }
                }
                if (!found) plantSelect.value = ""; // custom typed value
            });

            // Sync plant select change back to text input
            plantSelect.addEventListener("change", () => {
                plantInput.value = plantSelect.value || "";
                [unitInput, plantInput].forEach(el => {
                    el.style.fontWeight = "bold";
                    el.style.color = "#0080ff";
                    el.style.webkitTextFillColor = "#0080ff";
                });
            });

            
            [unitInput, plantInput].forEach(el => {
                el.style.fontWeight = "bold";
                el.style.color = "#0080ff";
                el.style.webkitTextFillColor = "#0080ff";
            });

            // Create a container for radio buttons (Plant-wide / Unit-wide)
            const radioContainer = document.createElement("div");
            radioContainer.style.display = "flex";
            radioContainer.style.justifyContent = "center";
            radioContainer.style.alignItems = "center";
            radioContainer.style.gap = "24px";
            radioContainer.style.marginTop = "0px";

            const plantRadio = document.createElement("input");
            plantRadio.type = "radio";
            plantRadio.name = "searchType";
            plantRadio.id = "plant-wide";
            plantRadio.value = "plant";
            plantRadio.checked = saved.searchType === "plant";

            const plantRadioLabel = document.createElement("label");
            plantRadioLabel.htmlFor = "plant-wide";
            plantRadioLabel.textContent = "Plant-wide";

            const unitRadio = document.createElement("input");
            unitRadio.type = "radio";
            unitRadio.name = "searchType";
            unitRadio.id = "unit-wide";
            unitRadio.value = "unit";
            unitRadio.checked = saved.searchType === "unit" || (!saved.searchType);

            const unitRadioLabel = document.createElement("label");
            unitRadioLabel.htmlFor = "unit-wide";
            unitRadioLabel.textContent = "Unit-wide";

            radioContainer.appendChild(plantRadio);
            radioContainer.appendChild(plantRadioLabel);
            radioContainer.appendChild(unitRadio);
            radioContainer.appendChild(unitRadioLabel);

            plantRadioLabel.style.fontSize = "24px";
            unitRadioLabel.style.fontSize = "24px";
            plantRadio.style.transform = "scale(3)";
            unitRadio.style.transform = "scale(3)";
            plantRadio.style.marginRight = "4px";
            unitRadio.style.marginRight = "4px";

            box.insertBefore(radioContainer, systemsBtn);

            // --- Enable/disable Unit input based on radio selection ---
            function updateUnitState() {
                if (plantRadio.checked) {
                    unitInput.disabled = true;
                    unitSelect.disabled = true;
                    unitInput.style.backgroundColor = "#ddd";
                    unitInput.style.color = "#666";
                    plantRadioLabel.style.fontWeight = "bold";
                    plantRadioLabel.style.color = "#0080ff";
                    plantRadioLabel.style.webkitTextFillColor = "#0080ff";
                    unitRadioLabel.style.fontWeight = "";
                    unitRadioLabel.style.color = "";
                    unitRadioLabel.style.webkitTextFillColor = "";
                    disableSystemsButton();
                } else {
                    unitInput.disabled = false;
                    unitSelect.disabled = false;
                    unitInput.style.backgroundColor = "";
                    unitInput.style.color = "#0080ff";
                    unitRadioLabel.style.fontWeight = "bold";
                    unitRadioLabel.style.color = "#0080ff";
                    unitRadioLabel.style.webkitTextFillColor = "#0080ff";
                    plantRadioLabel.style.fontWeight = "";
                    plantRadioLabel.style.color = "";
                    plantRadioLabel.style.webkitTextFillColor = "";
                    updateUnitList();
                }
            }

            plantRadio.addEventListener("change", updateUnitState);
            unitRadio.addEventListener("change", updateUnitState);

    //new code starts here
    // Create container for the three checkboxes
    const checkboxContainer = document.createElement("div")
    checkboxContainer.style.cssText = \`
        display: flex;
        justify-content: center;
        font-size: 24px;
        align-items: center;
        gap: 20px;
        margin-top: 8px;
        padding: 4px 55px;
        background: rgba(180, 200, 255, 0.9);
        border-radius: 40px;
    \`;

    // Function to create individual checkbox
    function createCheckbox(label, savedKey, savedObj) {
        const wrapper = document.createElement("label")
        wrapper.style.cssText = \`
            display: flex;
            align-items: center;
            gap: 10px;
        \`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox"
        checkbox.id = savedKey;  // Add ID
   

        wrapper.addEventListener('mouseenter', () => {
            wrapper.style.transform = 'scale(1.15)';
        });

        wrapper.addEventListener('mouseleave', () => {
            wrapper.style.transform = 'scale(1)';
        });

        // Check if the saved value exists and is truthy
        checkbox.checked = savedObj[savedKey] || false

        checkbox.onchange = () => {
            // Update the saved object with checkbox state
            savedObj[savedKey] = checkbox.checked
            updateSeleniumCreds()
        };

        wrapper.appendChild(checkbox)
        wrapper.appendChild(document.createTextNode(label))
        
        return wrapper
    }

    // Create the three checkboxes
    const plantsCheckbox = createCheckbox("Initialize Plants?", "scrapePlants", saved)
    const unitsCheckbox = createCheckbox("Initialize Units?", "scrapeUnits", saved)
    const systemsCheckbox = createCheckbox("Initialize Systems?", "scrapeSystems", saved)

    // Add checkboxes to container
    checkboxContainer.appendChild(plantsCheckbox)
    checkboxContainer.appendChild(unitsCheckbox)
    checkboxContainer.appendChild(systemsCheckbox)

    radioContainer.parentNode.insertBefore(checkboxContainer, radioContainer.nextSibling)

    //end of new code

            updateUnitState(); // initialize

            // Initialize lists
            updateUnitList();
            updatePlantList();




            const pw = box.querySelector("#pw")
            pw.addEventListener("focus", () => {
                pw.type = "text"
            })
            pw.addEventListener("blur", () => {
                pw.type = "password"
            })

            function clearError() {
                const existing = box.querySelector("#error-msg");
                if (existing) {
                    unitInput.style.borderColor = "";   
                    existing.remove();
                }   
            }

            function disableSystemsButton() {
                //const systemsButton = box.querySelector("#systems");

                systemsBtn.classList.remove("rainbow");
                systemsBtn.style.cursor = "not-allowed";
                systemsBtn.style.color = "black";
                systemsBtn.disabled = true;
            }

            function enableSystemsButton() {
                //const systemsBtn = box.querySelector("#systems");
                systemsBtn.classList.add("rainbow");
                systemsBtn.style.cursor = "pointer";
                systemsBtn.disabled = false;
            }

            plantRadio.addEventListener("change", () => {
                clearError()
            })

            unitRadio.addEventListener("change", () => {
                clearError()
            })

            function showSystemsError(msg) {
                let errorMsg = document.getElementById("error-msg");
                if (!errorMsg) {
                    errorMsg = document.createElement("div");
                    errorMsg.id = "error-msg";
                    //errorMsg.style.position = "absolute";
                    errorMsg.style.display = "flex";
                    //errorMsg.style.bottom = "-28px";   // just below input
                    errorMsg.style.justifyContent = "center";
                    errorMsg.style.alignItems = "center";
                    errorMsg.style.color = "red";
                    errorMsg.style.fontSize = "24px";
                    //errorMsg.style.height = "24px";    // reserve space so it doesn't push layout
                    errorMsg.style.pointerEvents = "none"; // so it doesn’t block clicks
                    box.insertBefore(errorMsg, systemsBtn);
                }
                errorMsg.textContent = msg;
            }


            function updateSeleniumCreds() {
                const values = {    
                    siteCode: box.querySelector("#sc").value,
                    username: box.querySelector("#un").value,
                    password: box.querySelector("#pw").value,
                    plant: box.querySelector("#pt").value,
                    unit: box.querySelector("#ut").value,
                    unitValue: fullOptions.find(
                                o => 
                                    o.unit === box.querySelector("#ut").value && 
                                    o.plant === box.querySelector("#pt").value &&
                                    o.siteCode === box.querySelector("#sc").value
                    )?.unitValue || "",
                    searchType: plantRadio.checked ? "plant" : "unit", 
                    selectedSystems: window._selectedSystems || [],
                    openLastRevision: window._openLastRevision || false,
                    scrapePlants: box.querySelector("#scrapePlants")?.checked || false,
                    scrapeUnits: box.querySelector("#scrapeUnits")?.checked || false,
                    scrapeSystems: box.querySelector("#scrapeSystems")?.checked || false
                }
                localStorage.setItem("seleniumCreds", JSON.stringify(values))
                window._seleniumCreds = values
            }

            box.querySelector("#submit").onclick = () => {
                // Clear previous error
                clearError()

                if (unitRadio.checked && unitInput.value.trim() === "") {
                    showSystemsError("No unit provided!")
                    unitInput.style.borderColor = "red";
                    unitInput.focus();
                    return;
                } 

                document.removeEventListener("keydown", menuKeybinds);

                updateSeleniumCreds()
                const creds = window._seleniumCreds;
                if (!creds) return;

                overlay.remove()
                callback(creds)
            }
            
            
            const menuKeybinds = (e) => {
                let modal = document.getElementById("systemsModal");
                let modalExcel = document.getElementById("excel-selector-modal");    
                if (e.key === "Enter" || e.code === "NumpadEnter") {
                    e.preventDefault();
                    if (!modal && !modalExcel){
                        submitBtn.click();
                    }
                } 
                if (e.key === "Escape" || e.keyCode === 27){
                    e.preventDefault();
                    if (modal && !modalExcel){
                        closeBtn.click();
                    }
                    if (modal && modalExcel){
                        cancelBtn.click();
                    } 
                }
            }
            document.addEventListener("keydown", menuKeybinds);

            /*

            [systemsBtn, submitBtn].forEach(el => {
                el.addEventListener('mouseenter', () => {
                    el.style.transform = 'scale(1.05)';
                    //el.style.color = "#0080ff";
                    //el.style.webkitTextFillColor = "#0080ff";
                }); 

                el.addEventListener('mouseleave', () => {
                    el.style.transform = 'scale(1)';
                    //el.style.color = "";
                    //el.style.webkitTextFillColor = "";
                });
            });

            
            

            [plantRadio, unitRadio].forEach(el => {
                el.addEventListener('mouseenter', () => {
                    el.style.transform = 'scale(3.75)';
                    el.style.color = "#0080ff";
                    el.style.webkitTextFillColor = "#0080ff";
                }); 

                el.addEventListener('mouseleave', () => {
                    el.style.transform = 'scale(3)';
                    el.style.color = "";
                    el.style.webkitTextFillColor = "";
                });
            });
            */

            //new code here
    function openSystemsModal(creds) {
        const systemsArray = fullOptions.filter(o =>
            o.siteCode === creds.siteCode &&
            o.plant === creds.plant &&
            o.unit === creds.unit &&
            o.system &&
            o.systemValue
        );

        console.log("systemsArray:", systemsArray)
        console.log("Saved in modal:", saved)
        console.log("fullOptions in modal:", fullOptions)

        // ---------- Create modal if not exists ----------
        modal = document.getElementById("systemsModal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "systemsModal";
        
            modal.style.cssText = \`
                display: flex;
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.2);
                z-index: 999999;
                justify-content: center;
                align-items: center;
            \`;
            document.body.appendChild(modal);

            const boxSystems = document.createElement("div");
            boxSystems.id = "systemsBox";
            boxSystems.style.cssText = \`
                background: rgb(255, 255, 255, 1);
                //background-size: 400% 400%;
                //opacity: 1;
                //animation: rainbow 50s linear infinite;
                padding: 10px;
                border-radius: 40px;
                border: black 3px solid;
                max-width: 100%;
                max-height: 80vh;
                width: 80%;
                height: auto;
                padding-bot: 10px;
                padding-top: 10px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                position: relative;
                overflow-y: auto;
            \`;
            modal.appendChild(boxSystems);

                        // Create title element
            const title = document.createElement("div")
            title.textContent = "Systems View" 
            title.classList.add("title-style");
            boxSystems.prepend(title)
            //title.classList.add("rainbow")


            // Close button
            const closeBtn = document.createElement("button");
            closeBtn.id = "closeBtn"
            closeBtn.textContent = "×";
            closeBtn.style.cssText = \`
                right: 8px;
                font-size: 24px;
                background: #ff00008c;
                border: none;
                cursor: pointer;
                padding: 12px 24px;
            \`;
            closeBtn.onclick = () => { 
                refreshSelectedSystems()
                resetScrapeCheckboxes();     
                modal.remove()
                
            }

            // Toolbar
            function resetScrapeCheckboxes() {
                // Get checkboxes
                const plantsCheckbox = document.getElementById("scrapePlants");
                const unitsCheckbox = document.getElementById("scrapeUnits");
                const systemsCheckbox = document.getElementById("scrapeSystems");
                
                // Reset to unchecked
                if (plantsCheckbox) {
                    plantsCheckbox.checked = false;
                    if (saved) saved.scrapePlants = false;
                }
                
                if (unitsCheckbox) {
                    unitsCheckbox.checked = false;
                    if (saved) saved.scrapeUnits = false;
                }
                
                if (systemsCheckbox) {
                    systemsCheckbox.checked = false;
                    if (saved) saved.scrapeSystems = false;
                }
                
                // Update localStorage
                updateSeleniumCreds();
                
                console.log("All scrape checkboxes reset to false");
            }

            function refreshSelectedSystems() {
                const selectedSystems = [];
                
                boxSystems.querySelectorAll("input[type=checkbox]:checked").forEach(cb => {
                    // If checkbox is inside a label
                    const label = cb.closest('label');
                    if (label) {
                        // Get all text content of label, excluding the checkbox itself
                        const text = label.textContent.trim();
                        selectedSystems.push(text);
                    } else {
                        // Fallback to value
                        selectedSystems.push(cb.value);
                    }
                });

                console.log("Selected systems:", selectedSystems);
                window._selectedSystems = selectedSystems;
                updateSeleniumCreds();
            }

            const toolbar = document.createElement("div");
            toolbar.style.cssText = "display:flex;justify-content:flex-end;gap:10px;margin-right:40px;margin-bottom:20px;opacity:0.9;";
            boxSystems.appendChild(toolbar);

            const selectAllBtn = document.createElement("button");
            selectAllBtn.textContent = "Select All";
            selectAllBtn.onclick = () => {
                boxSystems.querySelectorAll("input[type=checkbox]").forEach(cb => {
                    cb.checked = true;
                    cb.dispatchEvent(new Event('change'));
                });
            };
            toolbar.appendChild(selectAllBtn);

            const clearAllBtn = document.createElement("button");
            clearAllBtn.textContent = "Clear All";
            clearAllBtn.onclick = () => {
                boxSystems.querySelectorAll("input[type=checkbox]").forEach(cb => {
                    cb.checked = false;
                    cb.dispatchEvent(new Event('change'));
                });
            };
            toolbar.appendChild(clearAllBtn);

            const importExcelBtn = document.createElement("button");
            importExcelBtn.textContent = "Import System Selections from Excel?";
            toolbar.appendChild(importExcelBtn);
            
            let openLastRevision = false

            const openLastRevisionBtn = document.createElement("button");
            openLastRevisionBtn.textContent = "Re-open Last Revision";
            openLastRevisionBtn.onclick = () => {
                let openLastRevision = true
                window._openLastRevision = openLastRevision;
                closeBtn.click()
                submitBtn.click()
            }
            toolbar.appendChild(openLastRevisionBtn);
            toolbar.appendChild(closeBtn)

            // Container for checkboxes
            const systemsContainer = document.createElement("div");
            systemsContainer.id = "systemsContainer";
            systemsContainer.style.cssText = \`
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px,1fr));
                gap:40px;
                margin: 2px 16px;
                background-color: rgba(180, 200, 255, 0.9); 
                border-radius: 40px;
                padding: 16px 16px;
            \`;
            boxSystems.appendChild(systemsContainer);


            // Excel import logic
            importExcelBtn.onclick = async () => { 
                    updateSeleniumCreds()
                    const creds = window._seleniumCreds;
                    console.log("Creds before Import:", creds)
                    getSystemsFromExcel(creds)
            }

                function getSystemsFromExcel(creds){
                    if (typeof XLSX === 'undefined') {
                        console.log("Appending xlsx script to document head");
                        const script = document.createElement('script');
                        script.src = 'https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/xlsx.full.min.js';
                        document.head.appendChild(script);
                    }
                    // Create modalExcel overlay
                    modalExcel = document.getElementById("excel-selector-modal");
                    if (!modalExcel){
                        modalExcel = document.createElement('div');
                        modalExcel.id = 'excel-selector-modal';
                        modalExcel.style.cssText = \`
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.2);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 999999;
                        \`;

                        document.body.appendChild(modalExcel); 
                        
                        // Create content box
                        const boxExcel = document.createElement('div');
                        boxExcel.style.cssText = \`
                            background: rgb(255, 255, 255);
                            padding: 30px;
                            font-size: 24px;
                            border: black 3px solid;
                            border-radius: 40px;
                            width: 70%;
                            height: auto;
                            max-width: 100%;
                            max-height: 80vh;
                            overflow-y: auto;
                        \`;
                        
                        // Add HTML form
                        boxExcel.innerHTML = \`
                            <div style="margin: 20px 0;">
                                <button id="selectFileBtn" style="padding:10px 20px;background:#007bff;cursor:pointer;">
                                    Select Excel File
                                </button>
                                <span id="fileName" style="margin-left:15px;font-size:16px;color:#666;">No file selected</span>
                                <input type="file" id="fileInput" accept=".xlsx,.xls" style="display:none;">
                            </div>
                            
                            <div id="sheetSelection" style="display: flex;margin: 10px 0px;justify-items:right;background-color:rgba(180, 200, 255, 0.9);border-radius:40px;padding: 16px;flex-wrap: nowrap;flex-direction: column;align-items: center;">
                                <label style="display:block;margin-bottom:8px;font-weight:bold;">Select Worksheet:</label>
                                <select id="sheetSelect" style="width:100%;padding:8px;border:1px solid #ddd; border-radius:40px;"></select>
                            </div>
                            
                            <div id ="unitSelectionExcel" style="display: flex;margin: 10px 0px;justify-items:right;background-color:rgba(180, 200, 255, 0.9);border-radius:40px;padding: 16px;flex-wrap: nowrap;flex-direction: column;align-items: center;">
                                <label style="display:block;margin-bottom:8px;font-weight:bold;">Unit Name to Filter:</label>
                                <select id="unitSelectExcel" style="width:100%;padding:8px;border:1px solid #ddd; border-radius:40px;"></select>
                            </div>
                            

                            <div id="columnSelection" style="display: flex;margin: 10px 0px;justify-items:right;background-color:rgba(180, 200, 255, 0.9);border-radius:40px;padding: 16px;flex-wrap: nowrap;flex-direction: column;align-items: center;">
                                <div style="display:grid;grid-template-columns:475px 475px;gap:20px;border-radius:40px;">
                                    <div>
                                        <label style="display:block;margin-bottom:8px;font-weight:bold;">System Column Index:</label>
                                        <input type="number" id="systemCol" value="0" min="0" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:40px;">
                                    </div>
                                    <div>
                                        <label style="display:block;margin-bottom:8px;font-weight:bold;">Unit Column Index:</label>
                                        <input type="number" id="unitCol" value="1" min="0" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:40px;">
                                    </div>
                                </div>
                            </div>
                            
                            <div id="previewArea" style="display:none;margin:20px 0;">
                                <label style="display:block;margin-bottom:8px;font-weight:bold;">Preview (first 3 rows):</label>
                                <div id="previewContent" style="background:#f5f5f5;padding:10px;border-radius:4px;font-size:16px;max-height:150px;overflow:auto;"></div>
                            </div>
                            
                            <div id="resultsArea" style="display:none;margin:20px 0;">
                                <label style="display:block;margin-bottom:8px;font-weight:bold;">Selected Systems:</label>
                                <div id="resultsContent" style="background:#f8f8f8;padding:10px;border-radius:4px;max-height:200px;overflow:auto;color:#666;font-style:italic;">
                                    Systems will appear here after processing
                                </div>
                            </div>
                            
                            <div style="margin-top:30px;text-align:right;">
                                <button id="cancelBtn" style="padding:10px 20px;background:#6c757d;cursor:pointer;margin-right:10px;">
                                    Cancel
                                </button>
                                <button id="confirmBtn" style="padding:10px 20px;background:#28a745;cursor:pointer;opacity:0.3;cursor:not-allowed;" disabled>
                                    Error: Select Excel File First.
                                </button>
                            </div>
                        \`;
                        
                        modalExcel.appendChild(boxExcel);

                        const title = document.createElement("div")
                        title.textContent = "Excel Import Tool"  
                        title.classList.add("title-style")
                        boxExcel.prepend(title)
                        
                        
                        // File input handling
                        const fileInput = document.getElementById('fileInput');
                        const selectFileBtn = document.getElementById('selectFileBtn');
                        const fileName = document.getElementById('fileName');
                        //const unitSelect = document.getElementById('unitSelect')
                        const unitSelectExcel = document.getElementById('unitSelectExcel');
                        const confirmBtn = document.getElementById('confirmBtn');

                        
                        //populate unitDropdown
                        let fullOptionsExcel = window._optionsBrowserMemory
                        console.log("fullOptions:", fullOptions)
                        console.log("creds:", creds)
                        console.log("saved:", saved)
                        console.log("fullOptionsExcel:", fullOptionsExcel)
                        
                        let filteredOptionsExcel = [
                            ...new Set(
                                fullOptionsExcel
                                    .filter(o => o.plant === creds.plant && o.siteCode === creds.siteCode)
                                    .map(o => o.unit)
                                    .filter(Boolean)
                            )
                        ];
                        console.log("Unit options filtered by plant:", JSON.stringify(filteredOptionsExcel, null, 2));
                        
                        sortedOptionsExcel = [...filteredOptionsExcel].sort((a, b) => 
                            a.localeCompare(b, undefined, { sensitivity: 'base' })
                        )
    
                        sortedOptionsExcel.forEach(unit => {
                            const selOpt = document.createElement("option");
                            selOpt.value = unit;
                            selOpt.textContent = unit; // REQUIRED
                            unitSelectExcel.appendChild(selOpt);
                        });
                        
                        // add empty selection at top and delete extras
                        if (!unitSelectExcel.options.length || unitSelectExcel.options[0].value !== "") {
                            const emptySel = document.createElement("option");
                            emptySel.value = "";
                            emptySel.textContent = "";
                            unitSelectExcel.insertBefore(emptySel, unitSelectExcel.firstChild);
                        }

                        for (let i = unitSelectExcel.options.length - 1; i > 0; i--) {
                            if (unitSelectExcel.options[i].value === "") {
                                unitSelectExcel.remove(i);
                            }
                        }

                        unitSelectExcel.value = creds.unit || "";

                     
                        











                        
                        selectFileBtn.onclick = () => fileInput.click();
                        
                        function updatePreview(sheetIndex) {
                            if (!window.excelWorkbook) return;
                            
                            const workbook = window.excelWorkbook;
                            const sheetName = workbook.SheetNames[sheetIndex];
                            const sheet = workbook.Sheets[sheetName];
                            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                            
                            const preview = rows.slice(0, 3).map((row, rowIndex) => {
                                const cells = row.map((cell, colIndex) => {
                                    const cellValue = cell !== undefined && cell !== null ? String(cell) : '';
                                    return \`[\${colIndex}] \${cellValue}\`;
                                });
                                return \`Row \${rowIndex}: \${cells.join(' | ')}\`;
                            }).join('\\n');
                            
                            document.getElementById('previewContent').textContent = preview;
                        }
                        
                        function processExcel() {
                            if (!window.excelWorkbook) return [];
                            
                            const sheetIndex = document.getElementById('sheetSelect').value;
                            const systemCol = parseInt(document.getElementById('systemCol').value);
                            const unitCol = parseInt(document.getElementById('unitCol').value);
                            const unitSelectExcel = document.getElementById('unitSelectExcel').value;
                            
                            const workbook = window.excelWorkbook;
                            const sheetName = workbook.SheetNames[sheetIndex];
                            const sheet = workbook.Sheets[sheetName];
                            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                            
                            // Filter systems where unit matches exactly
                            const systems = [];
                            for (const row of rows.slice(1)) {
                                if (row[unitCol] && row[systemCol]) {
                                    const rowUnit = String(row[unitCol]).trim();
                                    const rowSystem = String(row[systemCol]).trim();
                                    if (rowUnit === unitSelectExcel && rowSystem) {
                                        systems.push(rowSystem);
                                    }
                                }
                            }
                            
                        return systems;
                    
                        }
                        
                        function updateResults() {
                            const systems = processExcel();
                            const resultsContent = document.getElementById('resultsContent');
                            const resultsArea = document.getElementById('resultsArea');
                            
                            if (systems.length > 0) {
                                resultsContent.innerHTML = systems.map((sys, i) => 
                                    \`<div style="padding:4px;border-bottom:1px solid #ddd;">\${i+1}. \${sys}</div>\`
                                ).join('');
                                resultsContent.style.background = '#e8f5e8';
                                resultsContent.style.color = '#000';
                                resultsContent.dataset.systems = JSON.stringify(systems);
                                
                                confirmBtn.textContent = \`Use \${systems.length} Systems\`;
                                confirmBtn.style.background = '#28a745';
                                confirmBtn.style.cursor = 'pointer'
                                confirmBtn.disabled = false;
                            } else {
                                resultsContent.innerHTML = '<div>No systems found matching criteria</div>';
                                resultsContent.style.background = '#f8f8f8';
                                resultsContent.style.color = '#666';
                                resultsContent.dataset.systems = '[]';
                                
                                confirmBtn.textContent = 'No Systems Found';
                                confirmBtn.style.background = '#dc3545';
                                confirmBtn.style.cursor = 'not-allowed'
                                confirmBtn.disabled = true;
                            }
                            
                            resultsArea.style.display = 'block';
                        }
                        
                        fileInput.onchange = async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                fileName.textContent = file.name;
                                fileName.style.color = '#28a745';

                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    const data = new Uint8Array(e.target.result);
                                    const workbook = XLSX.read(data, { type: 'array' });
                                    window.excelWorkbook = workbook;
                                    
                                    // Populate sheet dropdown
                                    const select = document.getElementById('sheetSelect');
                                    select.innerHTML = '';
                                    workbook.SheetNames.forEach((name, index) => {
                                        const option = document.createElement('option');
                                        option.value = index;
                                        option.textContent = name;
                                        select.appendChild(option);
                                    });
                                    
                                    // Show UI
                                    document.getElementById('sheetSelection').style.display = 'block';
                                    document.getElementById('columnSelection').style.display = 'block';
                                    document.getElementById('previewArea').style.display = 'block';

                                    confirmBtn.style.opacity = '1';
                                    confirmBtn.style.cursor = 'pointer';
                                    confirmBtn.disabled = false;
                                    confirmBtn.textContent = 'Process Systems';
                                    confirmBtn.style.background = '#007bff';
                                    
                                    // Show preview of first sheet
                                    updatePreview(0);
                                    // Update results
                                    updateResults();
                                };
                                reader.readAsArrayBuffer(file);
                            }
                        };
                        
                        // Handle sheet selection change
                        document.getElementById('sheetSelect').addEventListener('change', (e) => {
                            updatePreview(e.target.value);
                            updateResults();
                        });
                        
                        // Handle input changes
                        document.getElementById('systemCol').addEventListener('input', updateResults);
                        document.getElementById('unitCol').addEventListener('input', updateResults);
                        document.getElementById('unitSelectExcel').addEventListener('input', updateResults);

                        // Cancel button
                        document.getElementById('cancelBtn').onclick = () => {
                            modalExcel.remove();
                        };
                        
                        // Confirm button
                        confirmBtn.onclick = () => {
                            const systems = JSON.parse(document.getElementById('resultsContent').dataset.systems || '[]');
                            window._selectedSystems = systems;
                            console.log("window._selectedSystems before import:", window._selectedSystems)
                            boxSystems.querySelectorAll("input[type=checkbox]").forEach(cb => {
                                // Only check if system is in _selectedSystems array
                                if (window._selectedSystems.includes(cb.value)) {
                                    cb.checked = true;
                                    console.log(cb.value, "was checked");
                                    cb.dispatchEvent(new Event('change'));
                                }
                            });
                            //refreshSelectedSystems();
                            console.log("window._selectedSystems after import:", window._selectedSystems)
                            document.body.removeChild(modalExcel);

                        };

                        modalExcel.classList.add("rainbow"); 
                        // Add different rainbow colors for each button
                        modalExcel.querySelectorAll('button').forEach((btn, index) => {
                            btn.classList.add('rainbow');
                            btn.style.fontSize = '16px';
                            btn.style.padding = '12px 24px';
                            
                            let hue1, hue2, hue3;

                            if (btn.id === "cancelBtn") {
                                hue1 = -20;      // dark red
                                hue2 = 10;     // red
                                hue3 = 40;     // light red
                            } 
                            else if (btn.id === "confirmBtn") {
                                hue1 = 0;    
                                hue2 = 180;    
                                hue3 = 360;    
                            }
                            else {
                                hue1 = Math.floor(Math.random() * 360);
                                hue2 = Math.floor(Math.random() * 360);
                                hue3 = Math.floor(Math.random() * 360);
                            }

                            btn.style.background = \`linear-gradient(270deg, 
                                hsl(\${hue1}, 100%, 50%), 
                                hsl(\${hue2}, 100%, 50%), 
                                hsl(\${hue3}, 100%, 50%),
                                hsl(\${hue1}, 100%, 50%))\`;

                            btn.style.backgroundSize = '400% 400%';
                            btn.style.animation = 'gradientShift 20s linear infinite';
                            btn.style.borderRadius = '40px';
                            btn.style.fontSize = '24px';
                            btn.style.opacity = '0.9';
                            //btn.style.color = 'white';
                            //btn.style.fontWeight = 'bold'; // Bold
                            //btn.style.textShadow =  '0 0 6px #52ebff, 0 0 12px #3e1cb7';
                            //btn.style.border = 'none';
                            if (btn.id === "confirmBtn") {
                                btn.style.cursor = 'not-allowed';
                                btn.disabled = true;
                                btn.style.opacity = '0.3';
                            } else {
                                btn.style.cursor = 'pointer';
                            }
                            btn.style.transition = 'transform 0.1s';
                            
                            btn.addEventListener('mouseenter', () => {
                                btn.style.transform = 'scale(1.15)';
                            });
                            
                            btn.addEventListener('mouseleave', () => {
                                btn.style.transform = 'scale(1)';
                            });
                        }); 
                    };           
                };
        

            // ---------- Populate checkboxes ----------
            const container = modal.querySelector("#systemsContainer");
            container.innerHTML = "";
            
            if (!Array.isArray(window._selectedSystems)) {
                window._selectedSystems =
                    creds.selectedSystems || [];
            }

            console.log("Selected systems:", window._selectedSystems)
            systemsArray.forEach(sys => {
                const wrapper = document.createElement("label");
                wrapper.style.cssText = \`
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border-radius: 40px;
                    margin: 5px 0;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    //border: 2px solid #0080ff;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    background: white;
                    position: relative;
                    overflow: auto;
                \`;

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = sys.system;
                checkbox.style.cssText = \`
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    accent-color: #000000;
                    margin: 0;
                    position: relative;
                    z-index: 2;
                \`;
                
                checkbox.checked = window._selectedSystems.includes(sys.system);

                const textSpan = document.createElement("span");
                textSpan.textContent = sys.system;
                textSpan.style.cssText = \`
                    font-size: 24px;
                    //opacity: 0.9;
                    //font-weight: 500;
                    //color: #000000;
                    position: relative;
                    z-index: 2;
                    transition: color 0.3s ease;
                \`;

                // Create gradient overlay
                const gradientOverlay = document.createElement('div');
                gradientOverlay.style.cssText = \`
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(270deg, blue, cyan, blue);
                    background-size: 80% 80%;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 1;
                \`;

                wrapper.appendChild(gradientOverlay);
                wrapper.appendChild(checkbox);
                wrapper.appendChild(textSpan);
                container.appendChild(wrapper);

                
                wrapper.addEventListener('mouseenter', () => {
                    wrapper.style.transform = 'scale(1.15)';
                    wrapper.style.zIndex = '10';
                    wrapper.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.5)';
                });

                wrapper.addEventListener('mouseleave', () => {
                    if (!checkbox.checked){
                    wrapper.style.transform = 'scale(1)';
                    wrapper.style.zIndex = '1';
                    wrapper.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    }
                    
                });

                checkbox.onchange = () => {
                    if (checkbox.checked) {
                        if (!window._selectedSystems.includes(sys.system)) {
                            window._selectedSystems.push(sys.system);
                        }
                        wrapper.style.transform = 'scale(1.15)';
                        gradientOverlay.style.opacity = '1';
                        gradientOverlay.style.animation = 'rainbow 40s linear infinite';
                    } else {
                        window._selectedSystems = window._selectedSystems.filter(
                            v => v !== sys.system
                        );
                        wrapper.style.transform = 'scale(1)';
                        gradientOverlay.style.opacity = '0';
                        gradientOverlay.style.animation = 'none';
                    }
                };

                // Initial state
                if (checkbox.checked) {
                    wrapper.style.transform = 'scale(1.15)';
                    gradientOverlay.style.opacity = '1';
                    gradientOverlay.style.animation = 'rainbow 40s linear infinite';
                }else{
                    wrapper.style.transform = 'scale(1)';
                    gradientOverlay.style.opacity = '0';
                    gradientOverlay.style.animation = 'none';
                }


            });

            // Add keyframe animation
            if (!document.querySelector('#gradient-shift-keyframes')) {
                const styleGradient = document.createElement('style');
                styleGradient.id = 'gradient-shift-keyframes';
                styleGradient.textContent = \`
                    @keyframes gradientShift {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                \`;
                document.head.appendChild(styleGradient);
            }
        

            modal.style.display = "flex";
            modal.classList.add("rainbow"); 
            // Add different rainbow colors for each button
            modal.querySelectorAll('button').forEach((btn, index) => {
                btn.classList.add('rainbow');
                btn.style.fontSize = '16px';
                btn.style.padding = '12px 24px';

                
                let hue1, hue2, hue3;

                if (btn.textContent.toLowerCase() === "clear all") {
                    hue1 = -20;      // dark red
                    hue2 = 10;       // red
                    hue3 = 40;       // light red
                } else if (btn.textContent.toLowerCase() === "select all") {
                    hue1 = 100;      // dark green
                    hue2 = 130;      // green
                    hue3 = 160;      // light green
                } else {
                    // Default blue colors
                    hue1 = 180;      // light blue
                    hue2 = 210;      // blue 
                    hue3 = 240;      // dark blue
                }

                btn.style.background = \`linear-gradient(270deg, 
                    hsl(\${hue1}, 100%, 50%), 
                    hsl(\${hue2}, 100%, 50%), 
                    hsl(\${hue3}, 100%, 50%),
                    hsl(\${hue1}, 100%, 50%))\`;

                btn.style.backgroundSize = '400% 400%';
                btn.style.animation = 'gradientShift 40s infinite';
                btn.style.borderRadius = '40px';
                btn.style.fontSize = '24px';
                //btn.style.color = 'white';
                //btn.style.fontWeight = 'bold'; // Bold
                //btn.style.textShadow =  '0 0 6px #52ebff, 0 0 12px #3e1cb7';
                //btn.style.border = 'none';
                btn.style.cursor = 'pointer';
                btn.style.transition = 'transform 0.1s';
                
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'scale(1.05)';
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'scale(1)';
                });
            });
            
            closeBtn.textContent = '✕';
            Object.assign(closeBtn.style, {
                background: '#ff0000',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '0',
                lineHeight: '1',        // Fix vertical alignment
                textAlign: 'center',    // Center text horizontally
                verticalAlign: 'middle' // Center vertically
            });

            window._systemsDone = false;
        }
    }

//end of new code




            box.querySelector("#systems").onclick = () => {
                clearError()
                updateSeleniumCreds()
                const creds = window._seleniumCreds;
                if (!creds) return;

                console.log("Creds", creds)
            
                //new code here
                window._systemsDone = false;
                openSystemsModal(creds);
                return window._systemsDone === true; //end of new code
            }
        //new code here
        
            

            // Make sure the box is focusable
            box.tabIndex = -1
            box.focus()
    `)
}

    //helper functions

    async function overlaypopup(version = 1) { 
        await waitForStableDOM(driver);
        await driver.wait(async () => {
            return await driver.executeScript(() => 
                document.readyState === 'complete' && 
                document.body && 
                (!window.jQuery || jQuery.active === 0)
            );
        }, 10000);

        // Choose which version to open
        if (version === 1) {
            return await overlaypopup1();//generic rainbow
        } else {
            return await overlaypopup1();//option 2 if exists
        }
    }

    async function overlaypopup1() {
        await waitForStableDOM(driver);
        await driver.wait(async () => {
            return await driver.executeScript(() => 
                document.readyState === 'complete' && 
                document.body && 
                (!window.jQuery || jQuery.active === 0)
            );
        }, 10000); 

        await driver.executeScript(() => {
            if (!document.querySelector("#selenium-overlay-style")) {
                const style = document.createElement("style");
                style.id = "selenium-overlay-style";
                style.textContent = `
                    @keyframes rainbow {
                        from { background-position: 0% 50%; }
                        to   { background-position: 200% 50%; }
                    }

                    #selenium-overlay {
                        pointer-events: none !important;
                        cursor: not-allowed !important;
                        user-select: none !important;
                    }
                    
                    #selenium-overlay-message {
                        pointer-events: none;
                        user-select: none;
                    }
                `;
                document.head.appendChild(style);
            }
        });

        return driver.executeScript(() => {
            let old = document.querySelector("#selenium-overlay");
            if (old) old.remove();

            const overlay = document.createElement("div");
            overlay.id = "selenium-overlay";
            overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: linear-gradient(
                    270deg,
                    red,
                    orange,
                    yellow,
                    green,
                    cyan,
                    blue,
                    indigo,
                    violet,
                    red,
                    orange,
                    yellow,
                    green,
                    cyan,
                    blue,
                    indigo,
                    violet
                );
                background-size: 400% 400%;
                opacity: 0.1;
                animation: rainbow 160s linear infinite;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                
                pointer-events: none !important;
                cursor: not-allowed !important;
                user-select: none !important;
                
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;

                outline: none;
            `;
            overlay.tabIndex = -1;
            overlay.focus();


            const message = document.createElement("div");
            message.id = "selenium-overlay-message";
            message.textContent = "Request completed successfully.";
            message.style.cssText = `
                background: rgba(255, 255, 255, 1);
                color: black;
                padding: 20px 40px;
                border-radius: 10px;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
                pointer-events: none;
                user-select: none;
                opacity: 1;
            `;

            const escapeHint = document.createElement("div");
            escapeHint.className = "escape-hint";
            escapeHint.innerHTML = "Press <kbd>ESC</kbd> to close";
            message.appendChild(escapeHint);

            overlay.appendChild(message);
            document.body.appendChild(overlay);

            const blockEvent = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            };

            ['click', 'mousedown', 'mouseup', 'dblclick', 'contextmenu'].forEach(event => {
                overlay.addEventListener(event, blockEvent, true);
            });

            const handleEscape = (e) => {
                if (e.key === 'Escape' || e.keyCode === 27) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Add fade out animation before removing
                    overlay.style.transition = 'opacity 0.3s ease';
                    overlay.style.opacity = '0';
                    
                    setTimeout(() => {
                        overlay.remove();
                        document.removeEventListener('keydown', handleEscape, true);
                    }, 300);
                    
                    return false;
                }
            };

            document.addEventListener('keydown', handleEscape, true);

            overlay.addEventListener('keydown', handleEscape);

            overlay._escapeHandler = handleEscape;

            return overlay;
        });
    }


    async function removeOverlay() {
        return driver.executeScript(() => {
            const overlay = document.getElementById("selenium-overlay");
            if (overlay) {
                // Clean up event listeners
                if (overlay._escapeHandler) {
                    document.removeEventListener('keydown', overlay._escapeHandler, true);
                }
                overlay.remove();
            }
        });
    }

    function updatePlantsJSON(newEntries) {
        let existing = [];
        // Load existing JSON if it exists
        if (fs.existsSync(filePath)) {
            try {
                existing = JSON.parse(fs.readFileSync(filePath, "utf-8"))
            } catch (err) {
                console.warn("Failed to parse existing JSON, starting fresh:", err)
                existing = []
            }
        }
        // Merge: replace or add new entries
        newEntries.forEach(newEntry => {
            const index = existing.findIndex(e => 
                e.siteCode === newEntry.siteCode &&
                e.plant === newEntry.plant
            );

            if (index >= 0) {
                existing[index] = newEntry // replace
            } else {
                existing.push(newEntry) // add
            }
        });
        // Save updated JSON
        fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf-8")
    }

    function updateUnitsJSON(newEntries) {
        let existing = [];
        // Load existing JSON if it exists
        if (fs.existsSync(filePath)) {
            try {
                existing = JSON.parse(fs.readFileSync(filePath, "utf-8"))
            } catch (err) {
                console.warn("Failed to parse existing JSON, starting fresh:", err)
                existing = []
            }
        }
        // Merge: replace or add new entries
        newEntries.forEach(newEntry => {
            const index = existing.findIndex(e => 
                e.siteCode === newEntry.siteCode &&
                e.plant === newEntry.plant && 
                e.unitValue === newEntry.unitValue
            );

            if (index >= 0) {
                existing[index] = newEntry // replace
            } else {
                existing.push(newEntry) // add
            }
        });
        // Save updated JSON
        fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf-8")
    }

    function updateSystemsJson(newEntries) {
        let existing = [];
        // Load existing JSON if it exists
        if (fs.existsSync(filePath)) {
            try {
                existing = JSON.parse(fs.readFileSync(filePath, "utf-8"))
            } catch (err) {
                console.warn("Failed to parse existing JSON, starting fresh:", err)
                existing = []
            }
        }

        newEntries.forEach(newEntry => {
            const index = existing.findIndex(e =>
                e.siteCode === newEntry.siteCode &&
                e.plant === newEntry.plant &&
                e.unit === newEntry.unit &&
                e.systemValue === newEntry.systemValue
            );

            if (index >= 0) {
                existing[index] = newEntry; // replace
            } else {
                existing.push(newEntry); // add
            }
        });

        fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
    }

    async function getBTextsInTable(driver, searchText, stopAfter = "Last DB Δ") {
        // Find the <b> that matches searchText, ignoring leading/trailing spaces and &nbsp;

        await driver.wait(async () => {
        return await driver.executeScript(() => 
            document.readyState === 'complete' && 
            document.body && 
            (!window.jQuery || jQuery.active === 0)
        );
        }, 10000);

        let targetB = await driver.wait(
            until.elementLocated(By.xpath(
                `//b[normalize-space(translate(., '\u00A0', ' ')) = '${searchText}']`
            )),
            10000
        )

        // Get the containing table
        let table = await targetB.findElement(By.xpath("./ancestor::table"))

        // Find all <b> elements inside that table
        let bElements = await table.findElements(By.xpath(".//b"))

        // Collect texts, optionally only after stopAfter
        let bTexts = []
        let startCollecting = stopAfter ? false : true

        for (bElem of bElements) {
            let text = await bElem.getText()
            let cleanText = text.replace(/\u00A0/g, ' ').trim()

            if (!startCollecting && cleanText === stopAfter) {
                startCollecting = true
                continue  // skip the stopAfter element itself
            }

            if (startCollecting && cleanText !== "") {
                bTexts.push(cleanText)
            }
        }

        return bTexts
    }

    async function waitForStableDOM(driver, timeout = 10000, checkInterval = 500) {
        const startTime = Date.now();
        let previousHTML = '';
        
        while (Date.now() - startTime < timeout) {
            const currentHTML = await driver.executeScript(() => 
                document.documentElement.outerHTML
            );
            
            if (currentHTML === previousHTML) {
                console.log('DOM is stable');
                return true;
            }
            
            previousHTML = currentHTML;
            await driver.sleep(checkInterval);
        }
        
        console.warn('DOM did not stabilize within timeout');
        return false;
    }


    // browser automation begins here

    let creds
    creds = await getCredentialsFromUser();

    console.log(JSON.stringify(creds, null, 2))
    //overlaypopup() //page 1
    await waitForStableDOM(driver);
    //input site code
    const siteCodeInput = await driver.wait(
        until.elementLocated(By.name("UIM_Widget_1_SiteCode")),
        10000
    )
    await waitForStableDOM(driver);
    await siteCodeInput.sendKeys(creds.siteCode, Key.ENTER)

    //overlaypopup() //page 2
    await waitForStableDOM(driver);
    //input usn and pw
    const usernameField = await driver.wait(
        until.elementLocated(By.name("UIM_Widget_1_UIM_Offset_I")),
        10000
    )
    await waitForStableDOM(driver);
    await usernameField.sendKeys(creds.username)
   
    const passwordField = await driver.wait(
        until.elementLocated(By.name("UIM_Widget_1_UIM_Offset_K")),
        10000
    )
    await waitForStableDOM(driver);
    await passwordField.sendKeys(creds.password, Key.ENTER)

    //overlaypopup() //page 3
    await waitForStableDOM(driver); 
    //scrape plants
    
    //overlaypopup() //page 3.5
    /*await driver.wait(
        until.elementLocated(By.name("UIM_Widget_1_Q_Show")),
        10000  // Wait up to 10 seconds
    );*/
    //await waitForStableDOM(driver);
    
    //console.log("Overlay removed")
    //select plant from table and save to json for autocompleting the input html just to flex
    //await waitForStableDOM(driver);
    console.log("Scrape Plants?:", creds.scrapePlants)
    if (creds.scrapePlants === true) {
        await driver.wait(
            until.elementLocated(By.name("UIM_Widget_1_Q_Show")),
            15000  // Wait up to 15 seconds
        );
        await waitForStableDOM(driver);
        //show more items
        const show100 = await driver.findElement(
            By.css(
                `select[name="UIM_Widget_1_Q_Show"] option[value="100"]`
            )
        )
        await waitForStableDOM(driver);
        await show100.click()
        await waitForStableDOM(driver);

        //click search
        let link = await driver.wait(
            until.elementLocated(By.xpath(`.//a[.//font//b[contains(normalize-space(.), 'Search')]]`)),
            10000
        )
        await waitForStableDOM(driver);
        await link.click()
        
        await waitForStableDOM(driver);

        let bTexts = await getBTextsInTable(driver, "Plant Name", "Last DB Δ");
        console.log("Scraped bTexts:", bTexts)

        await waitForStableDOM(driver);

        let scrapedPlants = await driver.executeScript((bTextsArg, credsArg) => {
            if (!bTextsArg || !bTextsArg.length) return [];
            return Array.from(bTextsArg).map(opt => ({
                plant: opt,
                siteCode: credsArg.siteCode
            }));
        }, bTexts, creds);

        await waitForStableDOM(driver);

        console.log("Scraped plants:", JSON.stringify(scrapedPlants, null, 2)) 
        updatePlantsJSON(scrapedPlants)

        await waitForStableDOM(driver);
    }

    //type plant name
    console.log("Plant:", creds.plant)
    if (creds.plant) {    
    await waitForStableDOM(driver);   
    const plantInput = await driver.wait(
        until.elementLocated(By.name("UIM_Widget_1_Q_Name")),
        10000
    )
    await waitForStableDOM(driver);
    await plantInput.sendKeys(creds.plant, Key.ENTER)
    }else{
        await waitForStableDOM(driver);
        overlaypopup()
        throw new Error("No plant specified.")
    }

    //overlaypopup() //page 4
    //removeOverlay()
    await waitForStableDOM(driver);
    //click plant link
    link = await driver.wait(
        until.elementLocated(By.xpath(`.//a[.//font//b[normalize-space(text())='${creds.plant}']]`)),
        10000
    )
    await waitForStableDOM(driver);
    await link.click()

    await waitForStableDOM(driver);
    //overlaypopup() //page 5
    //click browse systems
    link = await driver.wait(
        until.elementLocated(By.xpath(`.//a[.//font//b[contains(normalize-space(.), 'Browse Systems')]]`)),
        10000
    )
    await waitForStableDOM(driver);
    await link.click()
    await waitForStableDOM(driver);

    if (creds.unit && creds.searchType=="unit") {
        //overlaypopup() //page 6
    }else {
        if (!creds.scrapeUnits){
            if (!creds.scrapeSystems){
                overlaypopup()
                throw new Error("Plant navigated to successfully.")
            }
        }
    }
    
    console.log("Scrape Units?:", creds.scrapeUnits)


    await waitForStableDOM(driver);
    //select unit from dropdown and save to json for autocompleting the input html just to flex
    if (creds.scrapeUnits === true) {
        let dropdownOptionsUnits = await driver.wait(
            until.elementLocated(By.name("UIM_Widget_1_Q_Unit")),
            10000
        )
        scrapedUnits = await driver.executeScript((credsArg) => {
            dropdownOptionsUnits = document.querySelector("[name='UIM_Widget_1_Q_Unit']")
            if (!dropdownOptionsUnits) return []
            return Array.from(dropdownOptionsUnits.options).map(opt => ({
                unitValue: opt.value,
                unit: opt.text,
                plant: credsArg.plant,
                siteCode: credsArg.siteCode
            }))
        }, creds)
        await waitForStableDOM(driver);
        console.log("Scraped Units:", JSON.stringify(scrapedUnits, null, 2)) 
        updateUnitsJSON(scrapedUnits)
    }


    console.log("searchType:", creds.searchType)
    await waitForStableDOM(driver);

    
    const originalUnit = creds.searchType === "unit" 
    ? creds.unit
    : ""


    //grab systems from clone system dropdown
    if (creds.scrapeSystems === true){
        if (creds.scrapeUnits === false){
            let dropdownOptionsUnits = await driver.wait(
                until.elementLocated(By.name("UIM_Widget_1_Q_Unit")),
                10000
            )
            scrapedUnits = await driver.executeScript((credsArg) => {
                dropdownOptionsUnits = document.querySelector("[name='UIM_Widget_1_Q_Unit']")
                if (!dropdownOptionsUnits) return []
                return Array.from(dropdownOptionsUnits.options).map(opt => ({
                    unitValue: opt.value,
                    unit: opt.text,
                    plant: credsArg.plant,
                    siteCode: credsArg.siteCode
                }))
            }, creds)
            await waitForStableDOM(driver);
        }

        const validUnits = scrapedUnits.filter(unit => 
            unit.unit && unit.unit.trim() !== "" && unit.unitValue && unit.unitValue.trim() !== ""
        );
        console.log(`Total units: ${scrapedUnits.length}, Valid units: ${validUnits.length}`);
        console.log("Valid units to process:", validUnits);
        if (validUnits.length === 0) {
            console.log("No valid units found to process");
            return;
        }
        console.log("Systems being scraped for the following scraped units:", scrapedUnits)

        for (const unitData of validUnits){
            //creds.unit = unitData.unit;
            //creds.unitValue = unitData.unitValue;
            console.log(`Processing unit [${unitData.unit}] with value [${unitData.unitValue}]`);
            
            try {
                // Wait for dropdown to be present (fresh each iteration in case of page changes)
                const unitDropdown = await driver.wait(
                    until.elementLocated(By.name("UIM_Widget_1_Q_Unit")),
                    10000
                );
                await waitForStableDOM(driver);
                
                // Find and click the option
                const option = await unitDropdown.findElement(
                    By.css(`option[value="${unitData.unitValue}"]`)
                );
                await waitForStableDOM(driver);
                await option.click();
                await waitForStableDOM(driver);
                
                console.log(`Selected unit: ${unitData.unit}`);
                
                
            } catch (error) {
                console.error(`Failed to select unit ${unitData.unit}:`, error.message);
                // Continue with next unit instead of stopping
                continue;
            }
            
        
            let dropdownOptions = await driver.wait(
                until.elementLocated(By.name("UIM_Widget_1_SystemClone")),
                10000
            )
            await waitForStableDOM(driver);
            dropdownOptions = await driver.executeScript((credsArg, unitDataArg) => {
                dropdownOptions = document.querySelector("[name='UIM_Widget_1_SystemClone']")
                if (!dropdownOptions) return []
                return Array.from(dropdownOptions.options).map(opt => ({
                    systemValue: opt.value,
                    system: opt.text,
                    unitValue: unitDataArg.unitValue,
                    unit: unitDataArg.unit,
                    plant: credsArg.plant,
                    siteCode: credsArg.siteCode
                }))
            }, creds, unitData)
            await waitForStableDOM(driver);
            console.log("System dropdown options:", JSON.stringify(dropdownOptions, null, 2)) 
            updateSystemsJson(dropdownOptions)
            await waitForStableDOM(driver);
        }
    }

    //navigate to unit originally saved in creds or plant if plant search

    try {
        // Wait for dropdown to be present (fresh each iteration in case of page changes)
        await driver.wait(
            until.elementLocated(By.name("UIM_Widget_1_Q_Unit")),
            10000
        );
        await waitForStableDOM(driver);
        
        // Find and click the option
        const option = await driver.findElement(
            By.xpath(`//select[@name="UIM_Widget_1_Q_Unit"]/option[normalize-space(text())="${originalUnit}"]`)
        );
        await waitForStableDOM(driver);
        await option.click();
        await waitForStableDOM(driver);
        
        console.log(`Returned to unit: ${originalUnit}`);
        
        } catch (error) {
            console.log(`Failed to select unit ${originalUnit}`);
            await waitForStableDOM(driver);
            overlaypopup()
            throw new Error("Can't navigate to correct unit.")
        }

    //overlaypopup() //page 8
    

    console.log("Selected systems:", creds.selectedSystems)
    console.log("Open last revision:", creds.openLastRevision)

    processSystemsWithConfirmation(creds.selectedSystems, creds.openLastRevision)

    async function processSystemsWithConfirmation(selectedSystems, openLastRevision) {
        if (!selectedSystems || selectedSystems.length === 0 || openLastRevision === false) {
            console.log("No systems selected to re-open");
            return;
        }

        console.log(`Processing ${selectedSystems.length} systems...`);
        
        for (let i = 0; i < selectedSystems.length; i++) {
            const system = selectedSystems[i];
            console.log(`\n[${i + 1}/${selectedSystems.length}] Processing: ${system}`);
            
            try {
                // 1. Click revisions link directly
                const clicked = await clickSystemRevisionsLink(system);
                if (!clicked) {
                    console.log(`Skipping ${system}`);
                    continue;
                }
                
                // 2. Wait for page
                //await driver.sleep(2000);
                await waitForStableDOM(driver);
                
                // 3. Check for reopen link
                const hasReopenLink = await checkIfReopenLinkExists();
                if (!hasReopenLink) {
                    console.log(`No reopen link for ${system}`);
                    await driver.navigate().back();
                    continue;
                }
                
                // 4. Click reopen link
                const reopenClicked = await clickReopenThisRevisionLink();
                if (!reopenClicked) {
                    console.log(`Could not click reopen for ${system}`);
                    await driver.navigate().back();
                    continue;
                }
                
                // 5. Handle confirmation
                //await handleReopenConfirmation();
                
                // 6. Go back
                
                //await driver.sleep(1000);
                await waitForStableDOM(driver);
                await driver.navigate().back();
                await waitForStableDOM(driver);
                
                console.log(`:D ${system} - Success`);
                
            } catch (error) {
                console.log(`>:( ${system}: ${error.message}`);
                try { await driver.navigate().back(); } catch (e) {}
            }
        }
    }

    // NEW: Find revisions link
    async function clickSystemRevisionsLink(systemName) {
        const cleanSystemName = systemName.replace(/\s+/g, ' ').trim();
        
        try {
            await removeOverlay();
            
            // Direct XPath for the specific pattern
            const revisionsLink = await driver.findElement(
                By.xpath(`//tr[contains(., '${cleanSystemName}')]//a[contains(@href, '../relief/revisions.p')]`)
            );
            
            await revisionsLink.click();
            console.log(`Clicked revisions link for ${cleanSystemName}`);
            return true;
            
        } catch (error) {
            console.log(`Could not click revisions link for ${cleanSystemName}: ${error.message}`);
            return false;
        }
    }

    // EXISTING: Check if reopen link exists
    async function checkIfReopenLinkExists() {
        try {
            // Look for the specific JavaScript href pattern
            const reopenLinks = await driver.findElements(
                By.css('a[href*="UIM_Post(\'ReOpen\'"]')
            );
            
            if (reopenLinks.length > 0) {
                console.log(`Found ${reopenLinks.length} Re-open link(s)`);
                
                // Log all found links
                for (let i = 0; i < reopenLinks.length; i++) {
                    try {
                        const link = reopenLinks[i];
                        const href = await link.getAttribute('href');
                        const revisionId = href.match(/UIM_Post\('ReOpen','([^']+)'/)?.[1];
                        console.log(`  Link ${i + 1}: Revision ID ${revisionId}`);
                    } catch (error) {
                        console.log(`  Link ${i + 1}: [Error]`);
                    }
                }
                
                return true;
            }
            
            console.log("No Re-open links found");
            return false;
            
        } catch (error) {
            console.log(`Error: ${error.message}`);
            return false;
        }
    }

    // EXISTING: Click reopen revision link
    async function clickReopenThisRevisionLink() {
        console.log("Clicking Re-open link...");
        
        // Find link with JavaScript UIM_Post('ReOpen' pattern
        const reopenLink = await driver.findElement(
            By.xpath("//a[contains(@href, \"UIM_Post('ReOpen'\")]")
        );
        
        await reopenLink.click();
        await handleReopenConfirmation();
        console.log("Clicked Re-open this Revision link");
    }

    // EXISTING: Handle confirmation
    async function handleReopenConfirmation() {
        console.log("Waiting for confirmation popup...");
        
        try {
            await driver.wait(async () => {
                try {
                    await driver.switchTo().alert();
                    return true;
                } catch (error) {
                    return false;
                }
            }, 5000);
            
            const alert = await driver.switchTo().alert();
            const alertText = await alert.getText();
            console.log(`Confirmation popup text: "${alertText}"`);
            await alert.accept();
            console.log("Clicked OK on confirmation popup");
            await driver.switchTo().defaultContent();
            
        } catch (error) {
            console.log("No confirmation popup found or error:", error.message);
        }
    }
    overlaypopup()
}

main()
