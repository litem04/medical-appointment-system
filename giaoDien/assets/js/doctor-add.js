const API_URL = "http://localhost:8080/api/v1/doctors";

document.getElementById("doctorForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const doctor = {
    fullName: document.getElementById("fullName").value,
    specialization: document.getElementById("specialization").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    imageUrl: document.getElementById("imageUrl").value
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(doctor)
    });

    if (!res.ok) throw new Error("Không thể thêm bác sĩ");
    alert("✅ Thêm bác sĩ thành công!");
    window.location.href = "doctors.html";
  } catch (err) {
    alert("❌ " + err.message);
  }
});
