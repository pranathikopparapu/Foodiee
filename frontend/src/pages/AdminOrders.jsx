router.get("/all", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (user.role !== "admin") return res.status(403).json("Forbidden");

  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});
