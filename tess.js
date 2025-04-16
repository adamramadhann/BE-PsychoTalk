async updatedProfile(req = request, res = response) {
  try {
    const { id } = req.user;
    const { name, bio, category } = req.body;
    const role = req.user.role;
    
    // Siapkan data untuk update
    const updateData = {};
    if (name) updateData.name = name;
    
    // Handle file upload
    let avatar;
    if (req.file) {
      avatar = `/uploads/${req.file.filename}`;
      // Tambahkan avatar ke data user jika perlu update avatar
      updateData.avatar = avatar;
    }
    
    // Update tabel user
    await db.user.update({
      where: { id: parseInt(id) },
      data: updateData
    });
    
    // Siapkan data untuk profile
    const profileData = {};
    if (bio) profileData.bio = bio;
    if (category) profileData.category = category;
    if (avatar) profileData.avatar = avatar;
    
    // Update tabel profile
    const profile = await db.profile.upsert({
      where: { userId: parseInt(id) },
      update: profileData,
      create: {
        userId: parseInt(id),
        bio: bio || '',
        avatar: avatar || '',
        category: category || null,
        role: role || "user"
      }
    });
    
    // Ambil data terbaru untuk response
    const updatedUser = await db.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        profile: true
      }
    });
    
    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email
      },
      profile: updatedUser.profile
    });
    
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}