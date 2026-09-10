const employeeTable =
    document.getElementById("employeeTable");

const employeeForm =
    document.getElementById("employeeForm");

const message =
    document.getElementById("message");


// Load employees
async function loadEmployees() {

    try {

        const response =
            await fetch("/api/employees");

        if (!response.ok) {
            throw new Error("Failed to load employees");
        }

        const employees =
            await response.json();

        employeeTable.innerHTML = "";

        employees.forEach(employee => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.role}</td>
                <td>${employee.department}</td>
                <td>${employee.email}</td>
            `;

            employeeTable.appendChild(row);
        });

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to load employees";

    }
}


// Add employee
employeeForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const employee = {

            name:
                document.getElementById("name").value,

            role:
                document.getElementById("role").value,

            department:
                document.getElementById("department").value,

            email:
                document.getElementById("email").value
        };

        try {

            const response =
                await fetch("/api/employees", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(employee)
                });

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to add employee"
                );
            }

            message.textContent =
                "Employee added successfully!";

            employeeForm.reset();

            loadEmployees();

        } catch (error) {

            console.error(error);

            message.textContent =
                "Failed to add employee: "
                + error.message;
        }
    }
);


// Load data when page opens
loadEmployees();