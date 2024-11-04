/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

import api from "../../../components/config/api";
import BarChart from "../../../components/barChart";

const RevenueLocation: React.FC = () => {
  const [isData, setIsData] = useState<any>(null);
  const [isPod, setIsPod] = useState<any>(null);
  const [isService, setIsService] = useState<any>(null);

  const fetchData = async () => {
    try {
      const location = await api.get("dashboard/revenue-by-location");
      setIsData(location.data.data);
      console.log(location.data.data);
      const pod = await api.get("dashboard/revenue-by-pod");
      setIsPod(pod.data.data);
      console.log(pod.data.data);
      const service = await api.get("dashboard/top-used-services");
      setIsService(service.data.data);
      console.log(service.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const barChartLabels = isData?.map(
    (item: { locationName: any }) => item.locationName
  );
  const barChartData = isData?.map((item: { revenue: any }) => item.revenue);
  const barChartLabelsPOD = isPod?.map(
    (item: { podName: any }) => item.podName
  );
  const barChartDataPOD = isPod?.map((item: { revenue: any }) => item.revenue);
  const barChartLabelsService = isService?.map(
    (item: { serviceName: any }) => item.serviceName
  );
  const barChartDataService = isService?.map(
    (item: { usageCount: any }) => item.usageCount
  );
  return (
    <div className="dashboard-container">
      <div className="chart-container">
        <div className="chart">
          <div className="chart-title">Doanh thu theo từng địa điểm</div>
          <BarChart labels={barChartLabels} data={barChartData} />
        </div>
        <div className="chart">
          <div className="chart-title">Doanh thu theo từng POD</div>
          <BarChart labels={barChartLabelsPOD} data={barChartDataPOD} />
        </div>
      </div>
      <div style={{ width: 650, margin: "50px 240px" }} className="chart">
        <div className="chart-title">Dịch vụ được sử dụng</div>
        <BarChart labels={barChartLabelsService} data={barChartDataService} />
      </div>
    </div>
  );
};

export default RevenueLocation;
