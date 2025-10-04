exports.getCurrentReservations = async () => {
    const now = new Date();
    // Toutes les réservations dont la date de fin est dans le futur
    return await Reservation.find({ endDate: { $gte: now } }).sort('startDate');
};